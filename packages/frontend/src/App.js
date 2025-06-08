// frontend/src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Lobby from './pages/Lobby';
import LobbyDetail from './pages/LobbyDetail';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { useThemeMode } from './context/ThemeModeContext';
import TombalaGame from '@gamecenter/tombala';

import { useSocket } from './context/WebSocketContext'; // 🔌 WS erişimi

/* ------------------------------------------------------------------ */
/* 🌐 Tüm uygulama için tek WS dinleyicisi – sayfa nerede olursa olsun */
function TombalaStartListener() {
  const socket   = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!socket) return;

    const handleStart = (lobbyId) => {
      console.log('🌐 tombala:start alındı → yönlen:', lobbyId);
      if (location.pathname !== `/tombala/play/${lobbyId}`) {
        navigate(`/tombala/play/${lobbyId}`, { replace: true });
      }
    };

    socket.on('tombala:start', handleStart);
    return () => socket.off('tombala:start', handleStart);
  }, [socket, navigate, location]);

  return null; // UI üretmez, sadece dinler
}
/* ------------------------------------------------------------------ */

function App() {
  const { user, tokenChecked } = useAuth();
  const { mode } = useThemeMode();

  if (!tokenChecked) return null;

  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <TombalaStartListener /> {/* 🔔 Global WS dinleyicisi eklendi */}
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/home" replace /> : <Login />
            }
          />
          <Route
            path="/home"
            element={
              user ? <Home /> : <Navigate to="/login" replace state={{ loginError: true }} />
            }
          />
          <Route
            path="/game/:gameId"
            element={
              user ? <GameDetail /> : <Navigate to="/login" replace state={{ loginError: true }} />
            }
          />
          <Route
            path="/lobby"
            element={
              user ? <Lobby /> : <Navigate to="/login" replace state={{ loginError: true }} />
            }
          />
          <Route
            path="/lobby/:id"
            element={
              user ? (
                <LobbyDetail />
              ) : (
                <Navigate to="/login" replace state={{ loginError: true }} />
              )
            }
          />

          {/* Tombala rotası değişmedi */}
          <Route path="/tombala/*" element={<TombalaGame />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
