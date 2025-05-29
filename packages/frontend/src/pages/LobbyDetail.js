import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, CircularProgress, Alert,
  ListItemText, Divider, Button, Grid
} from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Countdown from '../components/Countdown';

function LobbyDetail() {
  const { id: lobbyId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, verifyToken } = useAuth();

  const [tokenVerified, setTokenVerified] = useState(false);
  const [lobby, setLobby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableGames, setAvailableGames] = useState([]);
  const [isInLobby, setIsInLobby] = useState(false);

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
          setIsInLobby(lobbyRes.data.participants?.includes(user.email));
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

  const joinLobby = async () => {
    try {
      await axios.post(`/api/lobbies/${lobbyId}/join`, {}, { withCredentials: true });
      setIsInLobby(true);
      setLobby(prev => ({
        ...prev,
        participants: [...(prev.participants || []), user.email],
        currentPlayers: prev.currentPlayers + 1,
      }));
    } catch {
      alert('Lobiye katılamadın');
    }
  };

  const leaveLobby = async () => {
  try {
    const res = await axios.post(`/api/lobbies/${lobbyId}/leave`, {}, { withCredentials: true });
    setIsInLobby(false);
    setLobby(prev => ({
      ...prev,
      participants: (prev.participants || []).filter(p => p !== user.email),
      currentPlayers: Math.max(0, (prev.participants?.length || 1) - 1),
      creatorLeftAt: res.data.creatorLeftAt || prev.creatorLeftAt  // 🔁 Burası önemli
    }));
  } catch {
    alert('Lobiden ayrılamadın');
  }
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

  const currentUser = user?.email || '';
  const isOwner = currentUser === lobby.createdBy;
  const username = currentUser.split('@')[0];
  const participants = lobby.participants || []; 
  const otherParticipants = participants.filter(p => p !== lobby.createdBy);
  const showLeave = participants.includes(currentUser);
  const showJoin = !participants.includes(currentUser) && (!isOwner || (isOwner && !participants.includes(currentUser)));


const creatorLeft = !participants.includes(lobby.createdBy);
const creatorLeftAt = lobby.creatorLeftAt ? new Date(lobby.creatorLeftAt) : null;

const expireTime = lobby.creatorLeftAt
  ? new Date(new Date(lobby.creatorLeftAt).getTime() + 8 * 60 * 60 * 1000)
  : null;
  const shouldShowCountdown = creatorLeftAt !== null;

  const isWithin8Hours = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = now - created;
    return diff < 8 * 60 * 60 * 1000;
  };
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
          <Typography>
            {lobby.isPrivate ? '🔒 Özel Lobi' : 'Herkese Açık'}
            {lobby.isEvent ? ' 📅 (Etkinlik Lobisi)' : ''}
          </Typography>
        </Grid>

        {lobby.isEvent && lobby.eventEndTime && (
          <Grid item xs={12}>
            <Typography variant="h6">Etkinliğin Bitmesine Kalan Süre:</Typography>
            <Countdown target={lobby.eventEndTime} />
          </Grid>
        )}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Kurucu:</Typography>
      <Typography sx={{ mb: 2 }}>👑 {lobby.createdBy.split('@')[0]}</Typography>

      <Typography variant="h6" gutterBottom>Katılımcılar:</Typography>
      <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
        {participants.includes(lobby.createdBy) && (
          <ListItem><ListItemText primary={lobby.createdBy.split('@')[0]} /></ListItem>
        )}
        {otherParticipants.length > 0 ? (
          otherParticipants.map((p, i) => (
            <ListItem key={i}><ListItemText primary={p.split('@')[0]} /></ListItem>
          ))
        ) : !participants.includes(lobby.createdBy) ? (
          <ListItem><ListItemText primary="Başka katılımcı yok." /></ListItem>
        ) : null}
      </List>

      {lobby.creatorLeftAt && (
        <Box sx={{ mt: 5, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.05)', py: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#ffa700' }}>
            Lobi otomatik kapanmasına kalan süre:
          </Typography>
          <Countdown target={expireTime} />
        </Box>
      )}

      <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        {showJoin && (
          <Button variant="contained" color="primary" onClick={joinLobby}>
            ✅ Lobiye Katıl
          </Button>
        )}
        {showLeave && (
          <Button variant="outlined" color="error" onClick={leaveLobby}>
            ❌ Lobiden Ayrıl
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" size="large" color="success" disabled>
          Oyunu Başlat (Yakında)
        </Button>
      </Box>
    </Box>
  </>
);
}

export default LobbyDetail