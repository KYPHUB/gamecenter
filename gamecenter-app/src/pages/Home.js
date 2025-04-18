  import React from 'react';
  import Navbar from '../components/Navbar';
  import {
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
    Button,
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  import { useEffect } from 'react';

  const games = [
    {
      id: 'pixel-runner',
      name: 'Pixel Runner',
      image: '/images/pixel-runner.jpg',
    },
    {
      id: 'galaxy-invaders',
      name: 'Galaxy Invaders',
      image: '/images/galaxy-invaders.jpg',
    },
    {
      id: 'cyber-sprint',
      name: 'Cyber Sprint',
      image: '/images/cyber-sprint.jpg',
    },
    {
      id: 'zombie-rush',
      name: 'Zombie Rush',
      image: '/images/zombie-rush.jpg',
    },
    {
      id: 'space-blaster',
      name: 'Space Blaster',
      image: '/images/space-blaster.jpg',
    },
    {
      id: 'ninja-escape',
      name: 'Ninja Escape',
      image: '/images/ninja-escape.jpg',
    },
    {
      id: 'sky-surfer',
      name: 'Sky Surfer',
      image: '/images/sky-surfer.jpg',
    },
    {
      id: 'alien-attack',
      name: 'Alien Attack',
      image: '/images/alien-attack.jpg',
    },
    {
      id: 'night-racer',
      name: 'Night Racer',
      image: '/images/night-racer.jpg',
    },
    {
      id: 'dragon-flight',
      name: 'Dragon Flight',
      image: '/images/dragon-flight.jpg',
    },
    {
      id: 'city-defender',
      name: 'City Defender',
      image: '/images/city-defender.jpg',
    },
    {
      id: 'tower-dash',
      name: 'Tower Dash',
      image: '/images/tower-dash.jpg',
    }
  ];



  function Home() {
    const navigate = useNavigate();
  
    
    useEffect(() => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') {
        navigate('/');
      }
    }, []);
    

    return (
      <>
        <Navbar />
        <Box
    sx={{
      background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      minHeight: '100vh',
      padding: 4,
      color: 'white',
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
              mb: 4,
            }}
          >
            Oyunlar
          </Typography>

          <Grid container spacing={5} justifyContent="center">
  {games.map((game, index) => (
    <Grid item key={index}>
      <Card
        sx={{
          width: 180,
          height: 250,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: 3,
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.03)' },
        }}
      >
  <CardMedia
    component="img"
    image={game.image}
    alt={game.name}
    sx={{
      width: '100%',
      height: 140,
      objectFit: 'cover'
    }}
  />

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  mb: 1,
                  color: '#333',
                }}
              >
                {game.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                  navigate(`/game/${game.id}`)
                }
              >
                Detaylar
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    

        </Box>
      </>
    );
  }

  export default Home;
