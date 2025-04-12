import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Lobby  from './pages/Lobby';
import LobbyDetail from './pages/LobbyDetail';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game/:gameId" element={<GameDetail />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/lobby/:id" element={<LobbyDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
