import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Salesforce authentication
  login: (credentials: { username: string; password: string; securityToken: string; instanceUrl: string }) =>
    ipcRenderer.invoke('sf:login', credentials),
  logout: () => ipcRenderer.invoke('sf:logout'),
  isAuthenticated: () => ipcRenderer.invoke('sf:isAuthenticated'),

  // GUS queries
  queryWork: (queryParams: any) => ipcRenderer.invoke('gus:queryWork', queryParams),
  queryEpics: (queryParams: any) => ipcRenderer.invoke('gus:queryEpics', queryParams),
  getWorkDetails: (workId: string) => ipcRenderer.invoke('gus:getWorkDetails', workId),
});
