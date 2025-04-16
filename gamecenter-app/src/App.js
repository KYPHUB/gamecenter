import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Lobby from './pages/Lobby';
import LobbyDetail from './pages/LobbyDetail';

function App() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('❌ Sunucuya ulaşılamadı'));
  }, []);

  return (
    <>
      <div style={{ backgroundColor: '#f1f1f1', padding: '8px 16px', fontSize: '14px', textAlign: 'center' }}>
        Backend Durumu: {status}
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game/:gameId" element={<GameDetail />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/lobby/:id" element={<LobbyDetail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
