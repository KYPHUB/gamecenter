import React from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

function Lobby() {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: 'linear-gradient(to right, #000428, #004e92)',
          minHeight: '100vh',
          color: 'white',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontFamily: 'Orbitron, sans-serif'
        }}
      >
        🎮 Oyun başlatılıyor...
      </Box>
    </>
  );
}

export default Lobby;
