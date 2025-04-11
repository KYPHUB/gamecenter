import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!isValidEmail(email)) {
      alert("Lütfen geçerli bir email adresi giriniz.");
      return;
    }
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email); 
    navigate('/home');
  };
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  
  

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
          />
          <TextField
            label="Şifre"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
            🎮 Giriş Yap
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
