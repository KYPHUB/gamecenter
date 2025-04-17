import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const dummyGameDetails = {
  'battle-quest': {
    title: 'Battle Quest',
    description: 'Bir strateji ve macera oyunu.',
    image: 'https://source.unsplash.com/random/800x400?strategy',
  },
  'space-wars': {
    title: 'Space Wars',
    description: 'Uzayda geçen destansı bir savaş.',
    image: 'https://source.unsplash.com/random/800x400?space',
  },
  'pixel-runner': {
    title: 'Pixel Runner',
    description: 'Sonsuz bir koşu oyununda reflekslerini test et!',
    image: 'https://source.unsplash.com/random/800x400?arcade',
  },
};

function GameDetail() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const game = dummyGameDetails[gameId];
  console.log(`🕹️ ${game?.title || 'Bilinmeyen'} detay sayfası yüklendi.`);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/');
    }
  }, []);
  

  if (!game) {
    return (
      <>
        <Navbar />
        <Box sx={{ padding: 4, color: 'white', background: '#121212', minHeight: '100vh' }}>
          <Typography variant="h5">Oyun bulunamadı.</Typography>
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h3" sx={{ fontFamily: 'Orbitron, sans-serif' }}>
          {game.title}
        </Typography>
        <img
          src={game.image}
          alt={game.title}
          style={{ width: '100%', maxWidth: 800, borderRadius: 12 }}
        />
        <Typography variant="body1" sx={{ fontSize: 18, textAlign: 'center', maxWidth: 800 }}>
          {game.description}
        </Typography>
       
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/lobby')}>
        🎮 Oyna
        </Button>

      </Box>
    </>
  );
}

export default GameDetail;
