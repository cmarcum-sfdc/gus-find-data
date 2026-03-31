import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { SalesforceAuthService } from './salesforceAuth';

let mainWindow: BrowserWindow | null = null;
const authService = new SalesforceAuthService();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for Salesforce authentication
ipcMain.handle('sf:login', async (_, credentials: { username: string; password: string; securityToken: string; instanceUrl: string }) => {
  try {
    const result = await authService.login(credentials);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('sf:logout', async () => {
  try {
    await authService.logout();
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('sf:isAuthenticated', async () => {
  return authService.isAuthenticated();
});

// IPC Handlers for GUS queries
ipcMain.handle('gus:queryWork', async (_, queryParams: any) => {
  try {
    const results = await authService.queryWork(queryParams);
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('gus:queryEpics', async (_, queryParams: any) => {
  try {
    const results = await authService.queryEpics(queryParams);
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('gus:getWorkDetails', async (_, workId: string) => {
  try {
    const result = await authService.getWorkDetails(workId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});
