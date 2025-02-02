const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const CryptoJS = require('crypto-js');
const Store = require('electron-store')

const store = new Store()
const ENCRYPTION_KEY = 'nova';

let mainWindow;
const downloads = new Map();

// Function to create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Enforces the use of contextBridge
      enableRemoteModule: false, // Disable remote module for security
      nodeIntegration: false, // Disable direct Node.js integration
    },
  });

  // Load the React app (development server URL or build path)
  mainWindow.loadURL('http://localhost:5173');
  // mainWindow.loadURL(`file://${path.join(__dirname, "build", "index.html")}`);

  // Handle the window closed event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (require('electron-squirrel-startup')) app.quit();
}

// Event: App is ready
app.on('ready', createWindow);

// Event: All windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Event: App is activated (e.g., when clicking the app icon on macOS)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function encryptFile(filePath) {
  const fileContent = fs.readFileSync(filePath)
  const encrypted = CryptoJS.AES.encrypt(fileContent.toString('base64'), ENCRYPTION_KEY)
  fs.writeFileSync(filePath, encrypted.toString())
}

function decryptFile(filePath) {
  const encryptedContent = fs.readFileSync(filePath, 'utf8')
  const decrypted = CryptoJS.AES.decrypt(encryptedContent, ENCRYPTION_KEY)
  return Buffer.from(decrypted.toString(CryptoJS.enc.Utf8), 'base64')
}

ipcMain.handle('startDownload', async (event, { url, metadata }) => {
  const fileName = `${metadata.class}_${metadata.term}_${metadata.week}_${metadata.lesson}.${metadata.type}`
  const downloadPath = path.join(app.getPath('userData'), 'downloads', fileName)
console.log(downloadPath,"downloadPath")
  if (fs.existsSync(downloadPath)) {
    return { status: 'exists', path: downloadPath }
  }

  const downloadInfo = {
    progress: 0,
    path: downloadPath,
    paused: false,
    stream: null,
    fileStream: null,
    metadata
  }

  downloads.set(url, downloadInfo)

  return new Promise((resolve, reject) => {
    const request = https.get(url, response => {
      const totalLength = parseInt(response.headers['content-length'], 10)
      let downloaded = 0

      if (!fs.existsSync(path.dirname(downloadPath))) {
        fs.mkdirSync(path.dirname(downloadPath), { recursive: true })
      }

      downloadInfo.stream = response
      downloadInfo.fileStream = fs.createWriteStream(downloadPath)

      response.on('data', chunk => {
        if (downloadInfo.paused) return
        downloaded += chunk.length
        downloadInfo.progress = (downloaded / totalLength) * 100
        mainWindow.webContents.send('downloadProgress', { url, progress: downloadInfo.progress })
      })

      response.pipe(downloadInfo.fileStream)

      downloadInfo.fileStream.on('finish', () => {
        encryptFile(downloadPath)
        store.set(`file:${downloadPath}`, metadata)
        resolve({ status: 'completed', path: downloadPath })
      })

      response.on('error', (error) => {
        reject(error)
        downloads.delete(url)
      })
    })

    request.on('error', (error) => {
      reject(error)
      downloads.delete(url)
    })
  })
})

ipcMain.handle('pauseDownload', (event, url) => {
  const download = downloads.get(url)
  if (download) {
    download.paused = true
    download.stream.pause()
    return true
  }
  return false
})

ipcMain.handle('resumeDownload', (event, url) => {
  const download = downloads.get(url)
  if (download) {
    download.paused = false
    download.stream.resume()
    return true
  }
  return false
})

ipcMain.handle('getFile', async (event, filePath) => {
  try {
    const decrypted = decryptFile(filePath)
    const tempPath = path.join(app.getPath('temp'), path.basename(filePath))
    fs.writeFileSync(tempPath, decrypted)
    return tempPath
  } catch (error) {
    console.error('Error decrypting file:', error)
    return null
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
    return {
      path: filePath,
      ...metadata
    }
  })
})