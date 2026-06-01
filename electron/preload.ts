import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  exportFile: (content: string, fileName: string) =>
    ipcRenderer.invoke('export-file', { content, fileName }),
})
