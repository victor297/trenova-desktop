const { app, BrowserWindow, ipcMain, protocol } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')
const CryptoJS = require('crypto-js')
const Store = require('electron-store')
const crypto = require('crypto');

const store = new Store()
const ENCRYPTION_KEY = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex');
// const ENCRYPTION_KEY = crypto.randomBytes(32); // Securely store this key
const IV_LENGTH = 16; // AES block size

let mainWindow
const downloads = new Map()
const openFiles = new Set()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      devTools: false,
      frame: false,  
    }
  })
  mainWindow.setMenuBarVisibility(false); // Hide menu bar

  if (true) {
    mainWindow.loadFile(path.join(__dirname, './build/index.html'))
    // mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
  if (require('electron-squirrel-startup')) {
    app.quit();
    return;
}

}

app.whenReady().then(() => {
  protocol.registerFileProtocol('safe-file', (request, callback) => {
    const url = request.url.replace('safe-file://', '')
    try {
      return callback(decodeURIComponent(url))
    } catch (error) {
      console.error(error)
    }
  })
}).then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})



function encryptFile(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  
  const encrypted = Buffer.concat([iv, cipher.update(fileContent), cipher.final()]);
  fs.writeFileSync(filePath, encrypted);
}

function decryptFile(filePath) {
  const encryptedContent = fs.readFileSync(filePath);
  const iv = encryptedContent.slice(0, IV_LENGTH);
  const encryptedData = encryptedContent.slice(IV_LENGTH);

  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  return decrypted;
}
// function encryptFile(filePath) {
//   const fileContent = fs.readFileSync(filePath)
//   const encrypted = CryptoJS.AES.encrypt(fileContent.toString('base64'), ENCRYPTION_KEY)
//   fs.writeFileSync(filePath, encrypted.toString())
// }

// function decryptFile(filePath) {
//   const encryptedContent = fs.readFileSync(filePath, 'utf8')
//   const decrypted = CryptoJS.AES.decrypt(encryptedContent, ENCRYPTION_KEY)
//   return Buffer.from(decrypted.toString(CryptoJS.enc.Utf8), 'base64')
// }

function cleanupTempFiles() {
  for (const filePath of openFiles) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error('Error cleaning up temp file:', error)
    }
  }
  openFiles.clear()
}

async function forceCloseFile(filePath) {
  return new Promise((resolve) => {
    try {
      // Force garbage collection to release file handles
      if (global.gc) {
        global.gc()
      }
      
      // Wait a bit for handles to be released
      setTimeout(() => {
        try {
          if (fs.existsSync(filePath)) {
            const fd = fs.openSync(filePath, 'r')
            fs.closeSync(fd)
          }
        } catch (error) {
          console.error('Error closing file:', error)
        }
        resolve()
      }, 100)
    } catch (error) {
      console.error('Error in forceCloseFile:', error)
      resolve()
    }
  })
}

async function safeDeleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      // Try to force close any open handles
      await forceCloseFile(filePath)
      
      try {
        fs.unlinkSync(filePath)
      } catch (error) {
        if (error.code === 'EPERM') {
          // If file is locked, wait and try again
          await new Promise(resolve => setTimeout(resolve, 100))
          fs.unlinkSync(filePath)
        } else {
          throw error
        }
      }
    }
    return true
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error)
    return false
  }
}

async function cleanupPartialDownload(downloadPath) {
  try {
    // Close any open file streams
    const download = Array.from(downloads.values()).find(d => d.path === downloadPath)
    if (download?.fileStream) {
      download.fileStream.end()
      download.fileStream = null
    }

    // Force close and delete files
    await safeDeleteFile(downloadPath)
    await safeDeleteFile(`${downloadPath}.temp`)
    
    store.delete(`file:${downloadPath}`)
    return true
  } catch (error) {
    console.error('Error cleaning up partial download:', error)
    return false
  }
}
const sanitizeString = (inputString) => {
  return inputString.replace(/[^a-zA-Z0-9_().]/g, ' ');
}


async function attemptDownload(url, downloadInfo, downloadPath, tempDownloadPath, resolve, reject) {
  try {
    if (downloadInfo.cancelled) {
      await cleanupPartialDownload(downloadPath)
      downloads.delete(url)
      reject(new Error('Download cancelled'))
      return
    }

    // Ensure temp directory exists
    const tempDir = path.dirname(tempDownloadPath)
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Clean up any existing temp file
    await cleanupPartialDownload(downloadPath)

    const request = https.get(url, response => {
      if (response.statusCode !== 200) {
        request.destroy()
        cleanupPartialDownload(downloadPath)
        downloads.delete(url)
        reject(new Error(`HTTP Error: ${response.statusCode}`))
        return
      }

      const totalLength = parseInt(response.headers['content-length'], 10)
      let downloaded = 0

      downloadInfo.stream = response
      downloadInfo.request = request

      // Create a new write stream
      if (downloadInfo.fileStream) {
        try {
          downloadInfo.fileStream.end()
          downloadInfo.fileStream = null
        } catch (error) {
          console.error('Error ending previous file stream:', error)
        }
      }

      try {
        downloadInfo.fileStream = fs.createWriteStream(tempDownloadPath, { 
          flags: 'w',
          mode: 0o666 // Set permissive file mode
        })
      } catch (error) {
        request.destroy()
        cleanupPartialDownload(downloadPath)
        downloads.delete(url)
        reject(error)
        return
      }

      downloadInfo.fileStream.on('error', async (error) => {
        request.destroy()
        await cleanupPartialDownload(downloadPath)
        downloads.delete(url)
        reject(error)
      })

      response.on('data', chunk => {
        if (downloadInfo.cancelled) {
          request.destroy()
          cleanupPartialDownload(downloadPath)
          downloads.delete(url)
          reject(new Error('Download cancelled'))
          return
        }

        if (downloadInfo.paused) return

        downloaded += chunk.length
        downloadInfo.progress = (downloaded / totalLength) * 100
        mainWindow?.webContents.send('downloadProgress', { 
          url, 
          progress: downloadInfo.progress,
          status: 'downloading',
          paused: downloadInfo.paused
        })
      })

      response.pipe(downloadInfo.fileStream)

      downloadInfo.fileStream.on('finish', async () => {
        try {
          if (downloadInfo.cancelled) {
            await cleanupPartialDownload(downloadPath)
            downloads.delete(url)
            reject(new Error('Download cancelled'))
            return
          }

          if (fs.existsSync(tempDownloadPath)) {
            const stats = fs.statSync(tempDownloadPath)
            if (stats.size === 0) {
              await cleanupPartialDownload(downloadPath)
              downloads.delete(url)
              reject(new Error('Downloaded file is empty'))
              return
            }

            // Close the file stream
            downloadInfo.fileStream.end()
            downloadInfo.fileStream = null

            // Wait for any file operations to complete
            await new Promise(resolve => setTimeout(resolve, 100))

            // Move temp file to final location
            try {
              fs.renameSync(tempDownloadPath, downloadPath)
            } catch (error) {
              if (error.code === 'EPERM') {
                // If file is locked, wait and try again
                await new Promise(resolve => setTimeout(resolve, 100))
                fs.renameSync(tempDownloadPath, downloadPath)
              } else {
                throw error
              }
            }
            
            // Encrypt the file
            encryptFile(downloadPath)
            
            // Update metadata
            store.set(`file:${downloadPath}`, downloadInfo.metadata)
            
            downloads.delete(url)
            resolve({ status: 'completed', path: downloadPath })
          } else {
            throw new Error('Temp file not found')
          }
        } catch (error) {
          console.error('Error processing download:', error)
          await cleanupPartialDownload(downloadPath)
          downloads.delete(url)
          reject(error)
        }
      })

      response.on('error', async (error) => {
        request.destroy()
        await cleanupPartialDownload(downloadPath)
        downloads.delete(url)
        reject(error)
      })
    })

    request.on('error', async (error) => {
      await cleanupPartialDownload(downloadPath)
      downloads.delete(url)
      reject(error)
    })

    // request.on('timeout', async () => {
    //   request.destroy()
    //   await cleanupPartialDownload(downloadPath)
    //   downloads.delete(url)
    //   reject(new Error('Download timeout'))
    // })

    downloadInfo.request = request
  } catch (error) {
    console.error('Download attempt error:', error)
    await cleanupPartialDownload(downloadPath)
    downloads.delete(url)
    reject(error)
  }
}

app.on('before-quit', cleanupTempFiles)

ipcMain.handle('startDownload', async (event, { url, metadata }) => {
  const fileName = sanitizeString(`${metadata.class}_Term ${metadata.term}_${metadata.week}_${metadata.lesson}.${metadata.type}`)
  const downloadPath = path.join(app.getPath('userData'), 'downloads', fileName)
// console.log(fileName,downloadPath,"hihihihi")
  // await cleanupPartialDownload(downloadPath)

  if (fs.existsSync(downloadPath)) {
    return { status: 'exists', path: downloadPath }
  }

  const downloadInfo = {
    progress: 0,
    path: downloadPath,
    paused: false,
    cancelled: false,
    stream: null,
    fileStream: null,
    request: null,
    metadata
  }

  downloads.set(url, downloadInfo)

  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(path.dirname(downloadPath))) {
        fs.mkdirSync(path.dirname(downloadPath), { recursive: true })
      }

      const tempDownloadPath = `${downloadPath}.temp`
      attemptDownload(url, downloadInfo, downloadPath, tempDownloadPath, resolve, reject)
    } catch (error) {
      cleanupPartialDownload(downloadPath)
      downloads.delete(url)
      reject(error)
    }
  })
})

ipcMain.handle('cancelDownload', async (event, url) => {
  const download = downloads.get(url)
  if (download) {
    download.cancelled = true
    if (download.fileStream) {
      download.fileStream.end()
      download.fileStream = null
    }
    if (download.request) {
      download.request.destroy()
    }
    await cleanupPartialDownload(download.path)
    downloads.delete(url)
    return true
  }
  return false
})

ipcMain.handle('cancelAllDownloads', async () => {
  // console.log(downloads,"downloads")
  for (const [url, download] of downloads.entries()) {
    download.cancelled = true
    if (download.fileStream) {
      download.fileStream.end()
      download.fileStream = null
    }
    if (download.request) {
      download.request.destroy()
    }
    await cleanupPartialDownload(download.path)
    downloads.delete(url)
  }
  return true
})

ipcMain.handle('pauseDownload', (event, url) => {
  const download = downloads.get(url)
  if (download) {
    download.paused = true
    download.stream.pause()
    mainWindow.webContents.send('downloadProgress', {
      url,
      progress: download.progress,
      status: 'downloading',
      paused: true
    })
    return true
  }
  return false
})

ipcMain.handle('resumeDownload', (event, url) => {
  const download = downloads.get(url)
  if (download) {
    download.paused = false
    download.stream.resume()
    mainWindow.webContents.send('downloadProgress', {
      url,
      progress: download.progress,
      status: 'downloading',
      paused: false
    })
    return true
  }
  return false
})

ipcMain.handle('getFile', async (event, filePath) => {
  try {
    const decrypted = decryptFile(filePath)
    const tempPath = path.join(app.getPath('temp'), `${Date.now()}-${path.basename(filePath)}`)
    fs.writeFileSync(tempPath, decrypted)
    openFiles.add(tempPath)
    return tempPath
  } catch (error) {
    console.error('Error decrypting file:', error)
    return null
  }
})

ipcMain.handle('deleteFile', async (event, filePath) => {
  try {
    cleanupTempFiles()
    await safeDeleteFile(filePath)
    store.delete(`file:${filePath}`)
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
})

ipcMain.handle('deleteAllFiles', async () => {
  try {
    cleanupTempFiles()
    const downloadsPath = path.join(app.getPath('userData'), 'downloads')
    if (fs.existsSync(downloadsPath)) {
      const files = fs.readdirSync(downloadsPath)
      for (const file of files) {
        const filePath = path.join(downloadsPath, file)
        try {
          await safeDeleteFile(filePath)
          store.delete(`file:${filePath}`)
        } catch (error) {
          console.error(`Error deleting file ${file}:`, error)
          continue
        }
      }
    }
    return true
  } catch (error) {
    console.error('Error deleting all files:', error)
    return false
  }
})

ipcMain.handle('getDownloadedFiles', async () => {
  const downloadsPath = path.join(app.getPath('userData'), 'downloads')
  if (!fs.existsSync(downloadsPath)) {
    return []
  }

  const files = fs.readdirSync(downloadsPath)
  return files.map(file => {
    const filePath = path.join(downloadsPath, file)
    const metadata = store.get(`file:${filePath}`)
    // console.log("metadata", metadata, "metadata")
    return metadata ? {
      path: filePath,
      ...metadata
    } : null
  }).filter(Boolean)
})