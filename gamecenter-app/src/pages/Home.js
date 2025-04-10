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

const games = [
  {
    title: 'Battle Quest',
    image: 'https://source.unsplash.com/random/400x200?game1',
  },
  {
    title: 'Space Wars',
    image: 'https://source.unsplash.com/random/400x200?space',
  },
  {
    title: 'Pixel Runner',
    image: 'https://source.unsplash.com/random/400x200?arcade',
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: 'linear-gradient(to right, #141e30, #243b55)',
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

        <Grid container spacing={3} justifyContent="center">
          {games.map((game, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={game.image}
                  alt={game.title}
                />
                <CardContent>
                  <Typography variant="h6">{game.title}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() =>
                      navigate(`/game/${game.title.toLowerCase().replace(/\s+/g, '-')}`)
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
