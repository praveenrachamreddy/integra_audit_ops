import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  sidebarOpen: boolean;
  theme: Theme;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  theme: 'system',
  
  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  setTheme: (theme: Theme) => {
    set({ theme });
  },
})); 