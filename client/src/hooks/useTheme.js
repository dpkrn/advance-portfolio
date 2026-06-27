import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useStore';
import { setTheme } from '../store/slices/uiSlice';

const THEME_COLORS = {
  dark: '#0a0a0f',
  light: '#fafafa',
};

export function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.dark);
}

export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(next));
  };

  return { theme, toggle, isDark: theme === 'dark' };
}
