const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getBackendUrl: () => ipcRenderer.invoke("get-backend-url"),
  getAuthToken: () => ipcRenderer.invoke("get-auth-token"),
  selectSavePath: (defaultName) => ipcRenderer.invoke("select-save-path", defaultName),
  selectFiles: (options) => ipcRenderer.invoke("select-files", options),
  saveFile: (filePath, buffer) => ipcRenderer.invoke("save-file", filePath, buffer),
  openFile: (buffer, filename) => ipcRenderer.invoke("open-file", buffer, filename),
});
