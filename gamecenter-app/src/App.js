import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Lobby  from './pages/Lobby';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game/:gameId" element={<GameDetail />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;
