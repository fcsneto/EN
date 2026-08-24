const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
  readTextFile: (filePath) => ipcRenderer.invoke('read-text-file', filePath),
  exportOverlay: (payload) => ipcRenderer.invoke('export-overlay', payload),
  copyText: (value) => ipcRenderer.invoke('copy-text', value)
});
