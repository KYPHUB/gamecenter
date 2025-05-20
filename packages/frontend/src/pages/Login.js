import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Snackbar
} from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();

  useEffect(() => {
    axios.get('/api/session-check', { withCredentials: true })
      .then(res => { if (res.data.loggedIn) navigate('/home'); })
      .catch(() => {});
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!email || (!password && !forgotMode)) {
      setError('⚠️ Lütfen e-posta ve şifreyi girin.');
      return;
    }
    rememberMe
      ? localStorage.setItem('rememberedEmail', email)
      : localStorage.removeItem('rememberedEmail');

    if (forgotMode) {
      setShowSnackbar(true);
      setForgotMode(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş sırasında bir hata oluştu.');
    }
  };

  return (
  <Box
    sx={{
      height: '100vh',          // ekranın tamamını kapla
    overflow: 'hidden',       // taşma olsa bile scrollbar gösterme
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'url("/images/new_bg.png")', // varsa arka plan
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    p: 0      
    }}
  >
     <Paper
    elevation={10}
    sx={{
      display: 'flex',
      width: { xs: '100%', sm: 800 },
      maxWidth: 1000,
      height: '70%',         // dıştan gelen 100vh’i doldur
      borderRadius: 3,
      overflow: 'hidden'      // çocuk elemanların taşmasına izin verme
    }}
  >
      {/* Sol kısım: sadece left_bg.png arkaplan */}
      <Box
        sx={{
          width: { xs: 0, md: '50%' },
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          backgroundImage: 'url("/images/left_bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1)'
        }}
      />

      {/* Sağ Panel: Teal-Bulut Arkaplanla Uyumlu Form */}
<Box
  component="form"
  onSubmit={handleSubmit}
  sx={{
    flexGrow: 1,
    background: 'linear-gradient(145deg, #002e2a 25%, #004d40 100%)',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    p: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 3,
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
    fontFamily: '"Poppins", sans-serif',
    color: '#e0f2f1'
  }}
>
  {/* Başlık */}
  <Typography
    variant="h3"
    align="center"
    sx={{
      fontWeight: 800,
      fontSize: '2rem',
      background: 'linear-gradient(90deg,rgb(167, 246, 238),rgb(116, 209, 194))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}
  >
    GameCenter
  </Typography>

  {/* Email */}
  <TextField
    label="Email"
    variant="outlined"
    type="email"
    fullWidth
    value={email}
    onChange={e => setEmail(e.target.value)}
    disabled={authLoading}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: 24,
        backgroundColor: 'rgba(0,30,30,0.7)',
        color: '#e0f2f1',
        '& fieldset': { borderColor: 'rgba(128,203,196,0.3)' },
        '&:hover fieldset': { borderColor: '#80cbc4' },
        '&.Mui-focused fieldset': { borderColor: '#004d40' }
      },
      '& .MuiInputLabel-root': { color: 'rgba(224,242,241,0.7)' },
      '& .MuiInputLabel-root.Mui-focused': { color: '#00ffdd !important' }
    }}
  />

  {/* Şifre */}
  {!forgotMode && (
    <TextField
      label="Şifre"
      variant="outlined"
      type="password"
      fullWidth
      value={password}
      onChange={e => setPassword(e.target.value)}
      disabled={authLoading}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 24,
          backgroundColor: 'rgba(0,30,30,0.7)',
          color: '#e0f2f1',
          '& fieldset': { borderColor: 'rgba(128,203,196,0.3)' },
          '&:hover fieldset': { borderColor: '#80cbc4' },
          '&.Mui-focused fieldset': { borderColor: '#004d40' }
        },
        '& .MuiInputLabel-root': { color: 'rgba(224,242,241,0.7)' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#00ffdd !important' }
      }}
    />
  )}

  {/* Beni Hatırla */}
  {!forgotMode && (
    <FormControlLabel
      control={
        <Checkbox
          checked={rememberMe}
          onChange={e => setRememberMe(e.target.checked)}
          sx={{
            color: '#004d40',
            '&.Mui-checked': { color: '#00ffdd' },
            '& .MuiSvgIcon-root': { fontSize: 20 }
          }}
        />
      }
      label="Beni hatırla"
      sx={{ color: '#e0f2f1' }}
    />
  )}

  {/* Hata Mesajı */}
  {error && (
    <Typography color="error" sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
      {error}
    </Typography>
  )}

  {/* Giriş Butonu */}
  <Button
    type="submit"
    variant="contained"
    fullWidth
    disabled={authLoading}
    sx={{
      mt: 1,
      borderRadius: 24,
      height: 50,
      fontWeight: 600,
      fontSize: '1rem',
      background: authLoading
        ? 'rgba(224,242,241,0.2)'
        : 'linear-gradient(90deg, #004d40, #80cbc4)',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.5)',
      '&:hover': {
        background: 'linear-gradient(90deg, #00332f, #4fb3bf)'
      }
    }}
  >
    {authLoading ? <CircularProgress size={24} color="inherit" /> : '🎮 GİRİŞ YAP'}
  </Button>

  {/* Şifremi Unuttum */}
  <Typography
    onClick={() => setForgotMode(true)}
    sx={{
      mt: 1,
      alignSelf: 'center',
      background: 'linear-gradient(90deg, #80cbc4,rgb(62, 169, 151))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      cursor: 'pointer',
      fontWeight: 500
    }}
  >
    Şifremi unuttum
  </Typography>

  {/* Snackbar */}
  <Snackbar
    open={showSnackbar}
    autoHideDuration={3000}
    onClose={() => setShowSnackbar(false)}
    message="📧 Şifreniz mailinize gönderildi ✅"
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    sx={{
      '& .MuiSnackbarContent-root': {
        backgroundColor: 'rgba(128,203,196,0.2)',
        color: '#80cbc4',
        fontWeight: 600,
        borderRadius: 8
      }
    }}
  />
</Box>
    </Paper>
  </Box>
);
}