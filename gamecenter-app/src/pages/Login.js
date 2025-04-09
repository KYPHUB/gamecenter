import React from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material';

function Login() {
  return (
    <Box
      sx={{
        backgroundImage: 'url("/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 400,
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          color: '#fff',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #ff005c, #ffa700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          GameCenter
        </Typography>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
          />
          <TextField
            label="Şifre"
            type="password"
            variant="outlined"
            fullWidth
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
          />
          <Button variant="contained" color="primary" fullWidth>
            🎮 Giriş Yap
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
