import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function GameDetail() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { verifyToken } = useAuth();

  const [tokenVerified, setTokenVerified] = useState(false);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token doğrulama
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
    const fetchGame = async () => {
      try {
        const response = await axios.get(`/api/games/${gameId}`, { withCredentials: true });
        setGame(response.data);
      } catch (err) {
        console.error("Oyun verisi alınamadı:", err.message);
        setError('Oyun bulunamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0f2027' }}>
          <CircularProgress color="info" />
          <Typography sx={{ ml: 2, color: 'white' }}>Oyun yükleniyor...</Typography>
        </Box>
      </>
    );
  }

  if (error || !game) {
    return (
      <>
        <Navbar />
        <Box sx={{ padding: 4, backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
          <Alert severity="error">{error || 'Oyun bulunamadı.'}</Alert>
          <Button onClick={() => navigate('/home')} sx={{ mt: 2 }} variant="outlined" color="inherit">
            Ana Sayfa
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
          minHeight: '100vh',
          padding: 6,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #00c9ff, #92fe9d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {game.name}
        </Typography>

        <img
          src={game.image}
          alt={game.name}
          style={{ width: '100%', maxWidth: 400, borderRadius: 12 }}
        />

        <Typography variant="body1" sx={{ fontSize: 18, textAlign: 'center', maxWidth: 800 }}>
          {game.description}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate(`/lobby`)}
        >
          Oyna
        </Button>
      </Box>
    </>
  );
}

export default GameDetail;
