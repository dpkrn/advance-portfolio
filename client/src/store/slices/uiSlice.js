import { createSlice } from '@reduxjs/toolkit';

const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    sidebarCollapsed: false,
    theme: storedTheme || 'dark',
    askPanelOpen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setAskPanelOpen: (state, action) => {
      state.askPanelOpen = action.payload;
    },
    openAskPanel: (state) => {
      state.askPanelOpen = true;
    },
    closeAskPanel: (state) => {
      state.askPanelOpen = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setTheme,
  toggleTheme,
  setAskPanelOpen,
  openAskPanel,
  closeAskPanel,
} = uiSlice.actions;
export default uiSlice.reducer;
