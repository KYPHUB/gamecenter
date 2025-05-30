import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  TextField,
  Snackbar
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';



function Home() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, verifyToken } = useAuth();
  const [tokenVerified, setTokenVerified] = useState(false);
  const [games, setGames] = useState([]);
  const [lobbies, setLobbies] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);

  const [lobbyLink, setLobbyLink] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);



  //  Kapanmış lobileri gizle
  const visibleLobbies = lobbies.filter(l => !l.status || l.status !== 'closed');

  //  24 saatten kısa süre kalan etkinlikler için sayaç göstermek
  const isEventSoon = (startDate) => {
    const now = new Date();
    const eventTime = new Date(startDate);
    const diff = eventTime - now;
    return diff <= 24 * 60 * 60 * 1000;
  };

const handleGoToLobby = () => {
  try {
    const url = new URL(lobbyLink);
    const parts = url.pathname.split('/');
    const lobbyId = parts[parts.length - 1];

    if (!lobbyId || !lobbyId.startsWith('lobby-')) {
      throw new Error();
    }

    navigate(`/lobby/${lobbyId}`);
  } catch {
    setSnackOpen(true);
  }
};


  // Oturum kontrolü
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

  //  Oyun ve Lobi verilerini çek
  useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchData = async () => {
        setLoadingData(true);
        setError(null);
        try {
          const [gamesResponse, lobbiesResponse] = await Promise.all([
            axios.get('/api/games', { withCredentials: true }),
            axios.get('/api/lobbies', { withCredentials: true })
          ]);

          setGames(gamesResponse.data);
          setLobbies(lobbiesResponse.data);
        } catch (err) {
          setError(err.response?.data?.message || "Veriler yüklenirken bir sorun oluştu.");
          if (err.response?.status === 401) {
            navigate('/login', { replace: true });
          }
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    } else if (!isAuthLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  //  Yeni lobi oluşturma yönlendirmesi
  const handleNewLobbyClick = () => {
    navigate('/lobby');
  };

  if (isAuthLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0f2027' }}>
        <CircularProgress color="info"/>
        <Typography sx={{ ml: 2, color: 'white' }}>Oturum kontrol ediliyor...</Typography>
      </Box>
    );
  }

  if (!tokenVerified) return null;

  return (
  <>
    <Navbar />
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
        minHeight: 'calc(100vh - 64px)',
        padding: { xs: 2, sm: 3, md: 4 },
        color: 'white',
      }}
    >
      {/* Lobi Linki Yapıştırma Alanı */}
      <Box sx={{
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <TextField
          label="Lobi Linki Yapıştır"
          variant="outlined"
          fullWidth
          value={lobbyLink}
          onChange={(e) => setLobbyLink(e.target.value)}
          InputProps={{ sx: { borderRadius: 3, color: 'white' } }}
          InputLabelProps={{ sx: { color: '#b0bec5' } }}
        />
        <Button
          onClick={handleGoToLobby}
          variant="contained"
          sx={{ borderRadius: 3, px: 4 }}
        >
          Git
        </Button>
      </Box>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message="Geçersiz bağlantı"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {error && (
        <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(255, 179, 0, 0.1)', color: '#ffb300' }}>
          {error}
        </Alert>
      )}

      {loadingData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ ml: 2 }}>Oyunlar ve Lobiler yükleniyor...</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, borderBottom: '1px solid rgba(255, 255, 255, 0.2)', pb: 2 }}>
            <Typography variant="h4" sx={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
              Ana Ekran
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ fontWeight: 'bold' }}
              onClick={handleNewLobbyClick}
            >
              Yeni Lobi Oluştur
            </Button>
          </Box>

          {/*  Oyunlar */}
          <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', mb: 2, color:'#92fe9d' }}>
            Oyunlar
          </Typography>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {games.length > 0 ? (
              games.map((game) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={game.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex', flexDirection: 'column',
                      borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(0, 201, 255, 0.4)' },
                      color: '#1c1c1c'
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`http://localhost:5000${game.image}`}
                      alt={game.name}
                      sx={{ height: 140, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                      <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1rem', flexGrow: 1 }}>
                        {game.name}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/game/${game.id}`)}
                        sx={{ mt: 'auto', background: 'linear-gradient(90deg, #00c9ff, #92fe9d)', color: '#1c1c1c', fontWeight: 'bold' }}
                      >
                        Detaylar
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ width: '100%', textAlign: 'center', color: '#ccc', p: 3 }}>Hiç oyun bulunamadı.</Typography>
            )}
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

          {/*  Aktif Lobiler */}
          <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', mb: 2, color:'#ffa700' }}>
            Aktif Lobiler
          </Typography>
          {visibleLobbies.length > 0 ? (
            <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.4)', borderRadius: 2, p: { xs: 1, sm: 2 } }}>
              {visibleLobbies.map((lobby, index) => (
                <React.Fragment key={lobby.id}>
                  <ListItem
                    secondaryAction={
                      <Button variant="contained" size="small" onClick={() => navigate(`/lobby/${lobby.id}`)} sx={{ bgcolor: '#ffa700', '&:hover': { bgcolor: '#ff8f00'} }}>
                        Katıl
                      </Button>
                    }
                    sx={{ py: 1.5 }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {lobby.name}
                          {lobby.isPrivate && <LockIcon fontSize="small" sx={{ color: '#ccc' }} />}
                          {lobby.isEvent && <EventIcon fontSize="small" sx={{ color: '#92fe9d' }} />}
                        </Box>
                      }
                      secondary={
                        <>
                          <div>Oyun: {lobby.game} | Oyuncular: {lobby.currentPlayers}/{lobby.maxPlayers}</div>
                          {lobby.isEvent && lobby.eventStartTime && (
                            isEventSoon(lobby.eventStartTime) ? (
                              <div>
                                Başlamasına: <Countdown target={lobby.eventStartTime} />
                              </div>
                            ) : (
                              <div>Etkinlik: {new Date(lobby.eventStartTime).toLocaleString('tr-TR')}</div>
                            )
                          )}
                        </>
                      }
                      primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                      secondaryTypographyProps={{ color: '#bdbdbd' }}
                    />
                  </ListItem>
                  {index < visibleLobbies.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography sx={{ textAlign: 'center', color: '#ccc', mt: 3 }}>Şu anda aktif lobi bulunmuyor.</Typography>
          )}
        </>
      )}
    </Box>
  </>
);
}

export default Home 