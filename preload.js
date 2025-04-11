// const { contextBridge, ipcRenderer } = require('electron')

// contextBridge.exposeInMainWorld('electron', {
//   invoke: (channel, data) => ipcRenderer.invoke(channel, data),
//   on: (channel, callback) => {
//     ipcRenderer.on(channel, (event, ...args) => callback(...args))
//   },
//   removeAllListeners: (channel) => {
//     ipcRenderer.removeAllListeners(channel)
//   }
// })

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, data) => {
    if (channel === 'getFile') {
      // Convert the returned path to a blob URL for video playback
      return ipcRenderer.invoke(channel, data).then(path => {
        if (path.startsWith('safe-file://')) {
          return path
        }
        return path
      })
    }
    return ipcRenderer.invoke(channel, data)
  },
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args))
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  }
})