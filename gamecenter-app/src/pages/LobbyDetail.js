import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, List, ListItem } from '@mui/material';
import Navbar from '../components/Navbar';

function LobbyDetail() {
  const { id } = useParams();
  const lobbies = JSON.parse(localStorage.getItem('lobbies')) || [];
  const lobby = lobbies[id];

  if (!lobby) {
    return (
      <>
        <Navbar />
        <Box sx={{ padding: 4, color: 'white', background: '#121212', minHeight: '100vh' }}>
          <Typography variant="h5">Lobi bulunamadı.</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
          minHeight: '100vh',
          padding: 6,
          color: 'white',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif' }}>
          {lobby.name}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Süre: {lobby.duration}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Oyuncu Sayısı: {lobby.players}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Oluşturan: {lobby.createdBy}
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Katılan Oyuncular:
        </Typography>

        {lobby.joinedUsers && lobby.joinedUsers.length > 0 ? (
          <List>
            {lobby.joinedUsers.map((user, index) => (
              <ListItem key={index}>👤 {user}</ListItem>
            ))}
          </List>
        ) : (
          <Typography>Bu lobiye henüz kimse katılmadı.</Typography>
        )}
      </Box>
    </>
  );
}

export default LobbyDetail;
