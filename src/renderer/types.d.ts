export interface ElectronAPI {
  login: (credentials: {
    username: string;
    password: string;
    securityToken: string;
    instanceUrl: string;
  }) => Promise<{ success: boolean; data?: any; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: () => Promise<boolean>;
  queryWork: (queryParams: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  queryEpics: (queryParams: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  getWorkDetails: (workId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
