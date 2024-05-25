export interface ElectronAPI {
  startBreak: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
