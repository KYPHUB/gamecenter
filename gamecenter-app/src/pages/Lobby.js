import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Lobby() {
  const [lobbyName, setLobbyName] = useState('');
  const [duration, setDuration] = useState('');
  const [players, setPlayers] = useState('');
  const [lobbies, setLobbies] = useState([]);
  const navigate = useNavigate();

  const handleCreateLobby = () => {
    if (
      lobbyName.trim() === '' ||
      duration === '' ||
      players === '' ||
      players < 2 ||
      players > 6
    ) {
      alert('⚠️ Lütfen tüm alanları eksiksiz ve geçerli şekilde doldurun. (Oyuncu sayısı 2-6 arası olmalı)');
      return;
    }

    const newLobby = {
      name: lobbyName,
      duration: `${duration} dk`,
      players: `${players} kişi`
    };

    setLobbies(prev => [...prev, newLobby]);
    setLobbyName('');
    setDuration('');
    setPlayers('');
  };

  useEffect(() => {
    localStorage.setItem('lobbies', JSON.stringify(lobbies));
  }, [lobbies]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: 'linear-gradient(to right, #000428, #004e92)',
          minHeight: '100vh',
          padding: 4,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif' }}>
          🎮 Lobi Oluştur
        </Typography>

        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <TextField
            label="Lobi Adı"
            variant="outlined"
            fullWidth
            value={lobbyName}
            onChange={(e) => setLobbyName(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
          />

          <TextField
            label="Süre (dk)"
            select
            variant="outlined"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            SelectProps={{ native: true }}
          >
            <option value="">Seçiniz</option>
            {[15, 30, 45, 60, 90, 120, 180].map((min) => (
              <option key={min} value={min}>{min} dk</option>
            ))}
          </TextField>

          <TextField
            label="Oyuncu Sayısı (2-6)"
            type="number"
            variant="outlined"
            fullWidth
            value={players}
            onChange={(e) => setPlayers(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
          />

          <Button variant="contained" color="primary" onClick={handleCreateLobby}>
            ➕ Lobi Oluştur
          </Button>
        </Paper>

        <Typography variant="h5" gutterBottom>Lobiler</Typography>
        <List>
          {lobbies.map((lobby, index) => (
            <React.Fragment key={index}>
              <ListItem
                secondaryAction={
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ fontWeight: 'bold', color: 'white', px: 3 }}
                    onClick={() => navigate(`/lobby/${index}`)}
                  >
                    🎮 Katıl
                  </Button>
                }
              >
                <ListItemText
                  primary={lobby.name}
                  secondary={
                    <Typography sx={{ color: '#ccc' }}>
                      Süre: {lobby.duration} | Oyuncu Sayısı: {lobby.players}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider light />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </>
  );
}

export default Lobby;
