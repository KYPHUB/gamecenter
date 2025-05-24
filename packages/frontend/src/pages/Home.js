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
  List, ListItem, ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, verifyToken } = useAuth();
  const [tokenVerified, setTokenVerified] = useState(false);
  const [games, setGames] = useState([]);
  const [lobbies, setLobbies] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);

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
        {error && <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(255, 179, 0, 0.1)', color: '#ffb300' }}>{error}</Alert>}

        {loadingData && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress color="inherit" />
            <Typography sx={{ ml: 2 }}>Oyunlar ve Lobiler yükleniyor...</Typography>
          </Box>
        )}

        {!loadingData && !error && (
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
              >
                Yeni Lobi Oluştur
              </Button>
            </Box>

            {/* Oyunlar Bölümü */}
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
                        image={game.image || '/placeholder.png'}
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

            {/* Aktif Lobiler Bölümü */}
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', mb: 2, color:'#ffa700' }}>
              Aktif Lobiler
            </Typography>
            {lobbies.length > 0 ? (
              <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.4)', borderRadius: 2, p: { xs: 1, sm: 2 } }}>
                {lobbies.map((lobby, index) => (
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
                        secondary={`Oyun: ${lobby.game} | Oyuncular: ${lobby.currentPlayers}/${lobby.maxPlayers}`}
                        primaryTypographyProps={{ color: 'white', fontWeight:'bold' }}
                        secondaryTypographyProps={{ color: '#bdbdbd' }}
                      />
                    </ListItem>
                    {index < lobbies.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />}
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

export default Home;
