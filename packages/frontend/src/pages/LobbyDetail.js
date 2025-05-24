import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, CircularProgress, Alert,
  ListItemText, Divider, Button, Grid
} from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function LobbyDetail() {
  const { id: lobbyId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, verifyToken } = useAuth();

  const [tokenVerified, setTokenVerified] = useState(false);
  const [lobby, setLobby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableGames, setAvailableGames] = useState([]);

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
    if (!isAuthLoading && user && lobbyId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [lobbyRes, gamesRes] = await Promise.all([
            axios.get(`/api/lobbies/${lobbyId}`, { withCredentials: true }),
            axios.get('/api/games', { withCredentials: true })
          ]);
          setLobby(lobbyRes.data);
          setAvailableGames(gamesRes.data);
        } catch (err) {
          console.error("Lobi detayı alınamadı:", err.message);
          setError('Lobi bilgisi yüklenemedi.');
          if (err.response?.status === 401) navigate('/login', { replace: true });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (!isAuthLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [lobbyId, navigate, user, isAuthLoading]);

  const getGameName = (gameId) => {
    return availableGames.find(g => g.id === gameId)?.name || gameId;
  };

  if (loading || isAuthLoading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', bgcolor: '#0f2027' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            {isAuthLoading ? 'Oturum kontrol ediliyor...' : 'Lobi bilgileri yükleniyor...'}
          </Typography>
        </Box>
      </>
    );
  }

  if (error || !lobby) {
    return (
      <>
        <Navbar />
        <Box sx={{ padding: 4, color: 'white', background: '#121212', minHeight: 'calc(100vh - 64px)' }}>
          <Alert severity="error">{error || 'Lobi bulunamadı.'}</Alert>
          <Button onClick={() => navigate('/home')} sx={{ mt: 2 }} variant="outlined" color="inherit">
            Ana Sayfaya Dön
          </Button>
        </Box>
      </>
    );
  }

  if (!tokenVerified) return null;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
          minHeight: 'calc(100vh - 64px)',
          padding: { xs: 2, sm: 4, md: 6 },
          color: 'white',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', borderBottom: '1px solid #ffa700', pb: 1, mb: 3 }}>
          {lobby.name}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: '#ccc', mb: 4 }}>
          Oyun: {getGameName(lobby.game)}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Oyuncular:</Typography>
            <Typography>{lobby.currentPlayers} / {lobby.maxPlayers}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Durum:</Typography>
            <Typography>{lobby.isPrivate ? '🔒 Özel Lobi' : 'Herkese Açık'}{lobby.isEvent ? ' ✨ (Etkinlik Lobisi)' : ''}</Typography>
          </Grid>
          {lobby.isEvent && lobby.eventEndTime && (
            <Grid item xs={12}>
              <Typography variant="h6">Etkinlik Bitiş:</Typography>
              <Typography>{new Date(lobby.eventEndTime).toLocaleString('tr-TR')}</Typography>
            </Grid>
          )}
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Katılan Oyuncular:
        </Typography>
        <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
          <ListItem><ListItemText primary="Oyuncu 1 (Siz)" /></ListItem>
          <ListItem><ListItemText primary="Oyuncu 2" /></ListItem>
          {lobby.currentPlayers > 2 && (
            <ListItem><ListItemText primary={`... ve ${lobby.currentPlayers - 2} diğer oyuncu`} /></ListItem>
          )}
          {lobby.currentPlayers === 0 && (
            <ListItem><ListItemText primary="Henüz katılan yok." /></ListItem>
          )}
        </List>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" size="large" color="success">
            Oyunu Başlat (Yakında)
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default LobbyDetail;
