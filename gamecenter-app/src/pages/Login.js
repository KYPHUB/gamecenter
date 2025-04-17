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
  console.log("🎮 Lobby bileşeni yüklendi.");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email) {
      alert("⚠️ Lütfen e-posta girin.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', 
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      } else {
        alert("❌ Giriş başarısız: " + data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("❌ Sunucuya bağlanılamadı.");
    }
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
