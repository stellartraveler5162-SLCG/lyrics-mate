import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { writeFile } from 'fs/promises'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: '词伴 Lyrics Mate',
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

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

ipcMain.handle('get-app-version', () => {
  try {
    return app.getVersion()
  } catch {
    return '1.0.0'
  }
})

ipcMain.handle('export-file', async (_event, { content, fileName }: { content: string; fileName: string }) => {
  if (!mainWindow) return { success: false }

  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: fileName,
    filters: [
      { name: '文本文件', extensions: ['txt'] },
      { name: '所有文件', extensions: ['*'] },
    ],
  })

  if (!result.canceled && result.filePath) {
    try {
      await writeFile(result.filePath, content, 'utf-8')
      return { success: true }
    } catch {
      return { success: false }
    }
  }
  return { success: false }
})
