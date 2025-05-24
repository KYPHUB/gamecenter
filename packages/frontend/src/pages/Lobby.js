import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText,
  Divider, CircularProgress, Alert, Select, MenuItem, FormControl,
  InputLabel, Grid, FormControlLabel, Switch
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';

function Lobby() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, verifyToken } = useAuth();

  const [tokenVerified, setTokenVerified] = useState(false);

  const [lobbies, setLobbies] = useState([]);
  const [loadingLobbies, setLoadingLobbies] = useState(true);
  const [errorLobbies, setErrorLobbies] = useState(null);

  const [lobbyName, setLobbyName] = useState('');
  const [creatingLobby, setCreatingLobby] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [availableGames, setAvailableGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [selectedGame, setSelectedGame] = useState('');

  const [maxPlayers, setMaxPlayers] = useState(6);
  const [isPrivate, setIsPrivate] = useState(false);

  // Token kontrolü
  useEffect(() => {
    const check = async () => {
      const valid = await verifyToken();
      if (!valid) {
        navigate('/login', { replace: true });
      } else {
        setTokenVerified(true);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchData = async () => {
        try {
          const [lobbiesResponse, gamesResponse] = await Promise.all([
            axios.get('/api/lobbies', { withCredentials: true }),
            axios.get('/api/games', { withCredentials: true })
          ]);
          setLobbies(lobbiesResponse.data.lobbies || []);
          setAvailableGames(gamesResponse.data || []);
        } catch (err) {
          setErrorLobbies("Veriler yüklenemedi.");
          if (err.response?.status === 401) navigate('/login', { replace: true });
        } finally {
          setLoadingLobbies(false);
          setLoadingGames(false);
        }
      };
      fetchData();
    } else if (!isAuthLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  const handleCreateLobby = async () => {
    setCreateError(null);
    if (!lobbyName || !selectedGame || maxPlayers < 2 || maxPlayers > 6) {
      setCreateError('Tüm alanları doldurun (oyuncu sayısı 2-6 arası).');
      return;
    }

    setCreatingLobby(true);
    try {
      const newLobbyData = {
        name: lobbyName.trim(),
        game: selectedGame,
        players: maxPlayers,
        duration: 5,
        isPrivate,
        createdBy: user?.email || 'Bilinmiyor'
      };

      const response = await axios.post('/api/lobbies', newLobbyData, { withCredentials: true });

      setLobbies(prev => [response.data.lobby, ...prev]);
      setLobbyName('');
      setSelectedGame('');
      setMaxPlayers(6);
      setIsPrivate(false);
    } catch (err) {
      setCreateError('Lobi oluşturulamadı.');
    } finally {
      setCreatingLobby(false);
    }
  };

  if (isAuthLoading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0f2027' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Oturum kontrol ediliyor...</Typography>
        </Box>
      </>
    );
  }

  if (!tokenVerified) return null;

  return (
    <>
      <Navbar />
      <Box sx={{ background: 'linear-gradient(to right, #000428, #004e92)', minHeight: '100vh', p: 4, color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', mb: 3 }}>
          🎮 Lobi Oluştur & Katıl
        </Typography>

        <Paper sx={{ p: 3, mb: 4, bgcolor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Yeni Lobi Oluştur</Typography>
          {createError && <Alert severity="error" sx={{ mb: 2 }}>{createError}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Lobi Adı"
                fullWidth
                value={lobbyName}
                onChange={(e) => setLobbyName(e.target.value)}
                disabled={creatingLobby}
                sx={{ input: { color: 'white' }, label: { color: '#ccc' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#ccc' }}>Oyun Seç</InputLabel>
                <Select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="" disabled><em>Bir oyun seçin</em></MenuItem>
                  {availableGames.map((g) => (
                    <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Oyuncu Sayısı"
                type="number"
                fullWidth
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Math.max(2, Math.min(6, parseInt(e.target.value) || 2)))}
                sx={{ input: { color: 'white' }, label: { color: '#ccc' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} color="secondary" />}
                label="Özel Lobi"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleCreateLobby} disabled={creatingLobby}>
                {creatingLobby ? <CircularProgress size={24} /> : '➕ Lobi Oluştur'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <Typography variant="h5" gutterBottom>Aktif Lobiler</Typography>

        {loadingLobbies && <CircularProgress />}
        {errorLobbies && <Alert severity="error">{errorLobbies}</Alert>}

        <List>
          {lobbies.map((lobby, index) => (
            <React.Fragment key={lobby.id}>
              <ListItem
                secondaryAction={
                  <Button variant="contained" onClick={() => navigate(`/lobby/${lobby.id}`)}>
                    Katıl
                  </Button>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {lobby.name}
                      {lobby.isPrivate && <LockIcon fontSize="small" />}
                      {lobby.isEvent && <EventIcon fontSize="small" />}
                    </Box>
                  }
                  secondary={`Oyun: ${availableGames.find(g => g.id === lobby.game)?.name || lobby.game} | Oyuncular: ${lobby.currentPlayers}/${lobby.maxPlayers}`}
                />
              </ListItem>
              {index < lobbies.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </>
  );
}

export default Lobby;
