import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, CircularProgress, Alert, Accordion, AccordionSummary,
  AccordionDetails, Switch, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  // Dummy ayar state'leri
  const [soundOn, setSoundOn] = useState(true);
  const [theme, setTheme] = useState('neon');
  const [difficulty, setDifficulty] = useState('easy');

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
          onClick={() => navigate('/lobby')}
        >
          Oyna
        </Button>

        {/* Ek Bölümler */}
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
              <Typography sx={{ fontWeight: 'bold', color: '#00c9ff' }}>🎮 Nasıl Oynanır?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Bu oyun bir refleks ve dikkat oyunudur. Ekrandaki engellerden kaçın ve puan topla. 
                WASD veya yön tuşları ile karakterini kontrol et.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
              <Typography sx={{ fontWeight: 'bold', color: '#92fe9d' }}>⚙️ Oyun Ayarları</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Ses Efektleri</Typography>
                <Switch
                  checked={soundOn}
                  onChange={() => setSoundOn(prev => !prev)}
                  color="info"
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Typography sx={{ mb: 1 }}>Tema</Typography>
                <ToggleButtonGroup
                  value={theme}
                  exclusive
                  onChange={(e, val) => val && setTheme(val)}
                  size="small"
                >
                  <ToggleButton value="neon">Neon</ToggleButton>
                  <ToggleButton value="classic">Klasik</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Typography sx={{ mb: 1 }}>Zorluk</Typography>
                <ToggleButtonGroup
                  value={difficulty}
                  exclusive
                  onChange={(e, val) => val && setDifficulty(val)}
                  size="small"
                >
                  <ToggleButton value="easy">Kolay</ToggleButton>
                  <ToggleButton value="medium">Orta</ToggleButton>
                  <ToggleButton value="hard">Zor</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Typography sx={{ fontSize: 12, color: '#bbb', mt: 1 }}>
                (Not: Bu ayarlar yalnızca görsel amaçlıdır, şu an işlevsel değildir.)
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
              <Typography sx={{ fontWeight: 'bold', color: '#ffaa00' }}>📜 Oyun Geçmişi</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Şimdilik bu oyun için geçmiş bulunmamaktadır. Gelecekteki versiyonlarda oynadığınız maçlar burada listelenecektir.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </>
  );
}

export default GameDetail;
