// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#00c9ff' },
    background: {
      default: '#f2faff',           
      paper: '#ffffff',         
    },
    text: {
      primary: '#2a2a2a',           
      secondary: '#666666',
    },
    divider: 'rgba(0, 0, 0, 0.1)',
  },
  customShadows: {
    card: '0 8px 24px rgba(0,0,0,0.08)',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#00eaff' },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#9e9e9e',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  customShadows: {
    card: '0 8px 24px rgba(0,0,0,0.4)',
  },
});
