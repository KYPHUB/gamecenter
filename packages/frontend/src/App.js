// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Lobby from './pages/Lobby';
import LobbyDetail from './pages/LobbyDetail';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { useThemeMode } from './context/ThemeModeContext';  

function App() {
  const { user, isLoading, tokenChecked } = useAuth();
  const { mode } = useThemeMode();

  if (!tokenChecked) return null;

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={
            user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          } />
          <Route path="/login" element={
            user ? <Navigate to="/home" replace /> : <Login />
          } />
          <Route path="/home" element={
            user ? <Home /> : <Navigate to="/login" replace state={{ loginError: true }} />
          } />
          <Route path="/game/:gameId" element={
            user ? <GameDetail /> : <Navigate to="/login" replace state={{ loginError: true }} />
          } />
          <Route path="/lobby" element={
            user ? <Lobby /> : <Navigate to="/login" replace state={{ loginError: true }} />
          } />
          <Route path="/lobby/:id" element={
            user ? <LobbyDetail /> : <Navigate to="/login" replace state={{ loginError: true }} />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
