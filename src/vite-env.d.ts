/// <reference types="vite/client" />

interface ElectronAPI {
  getAppVersion: () => Promise<string>
  exportFile: (content: string, fileName: string) => Promise<{ success: boolean }>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
