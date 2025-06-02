import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
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
import SoundButton from '../components/SoundButton';
import SoundSwitch from '../components/SoundSwitch';
import NotifySound from '../components/NotifySound'


export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, logout, isLoading: authLoading, verifyToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [rememberedUser, setRememberedUser] = useState(null);


  useEffect(() => {
    if (sessionStorage.getItem('loginError') === '1') {
      setError('⚠️ Oturum süresi doldu veya geçersiz. Lütfen tekrar giriş yapın.');
      sessionStorage.removeItem('loginError');
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('rememberedUser');
    if (stored) {
      try {
        setRememberedUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('rememberedUser');
      }
    }
  }, []);

  useEffect(() => {
  if (showSnackbar) {
    NotifySound(); 
  }
}, [showSnackbar]);

  useEffect(() => {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);
  

  const handleQuickLogin = async () => {
  if (!rememberedUser) return;
  try {
    const response = await axios.post('/api/token-verify', {
      token: rememberedUser.token
    }, { withCredentials: true });

    if (response.data.success) {
      // Kullanıcıyı tanıt (elle oturumu başlat)
      localStorage.setItem('user_token', rememberedUser.token);

      // ✅ Kullanıcıyı set etmek için logout → ardından token zaten kontrol edilecek
      window.location.href = '/home'; // Hard redirect ile tüm context tetiklenir
    } else {
      setError('⚠️ Hızlı giriş başarısız oldu. Lütfen tekrar giriş yapın.');
      localStorage.removeItem('rememberedUser');
      setRememberedUser(null);
    }
  } catch (err) {
    setError('⚠️ Otomatik giriş sırasında hata oluştu.');
    localStorage.removeItem('rememberedUser');
    setRememberedUser(null);
  }
};


  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!email || (!password && !forgotMode)) {
      setError('⚠️ Lütfen e-posta ve şifreyi girin.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedEmail');
    }

    if (forgotMode) {
      setShowSnackbar(true);
      setForgotMode(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Giriş sırasında bir hata oluştu.'
      );
    }
  };


  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/images/new_bg.png")',
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
          height: '70%',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
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
          <SoundButton
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
            {authLoading
              ? <CircularProgress size={24} color="inherit" />
              : forgotMode
              ? '📨 ŞİFRE GÖNDER'
              : '🎮 GİRİŞ YAP'}
          </SoundButton>
          
          {forgotMode && (
          <Typography
            onClick={() => setForgotMode(false)}
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
            🔙 Girişe dön
          </Typography>
        )}

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

      {/* Hızlı Giriş Butonu */}
      {rememberedUser && (
        <Box
  sx={{
    position: 'fixed',
    bottom: 24,
    right: 24,
    backgroundColor: '#26a69a',
    color: '#fff',
    fontWeight: 600,
    fontSize: 22,
    width: 100,
    height: 100,
    borderRadius: 6, // 🔁 kavisli köşeler için
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    zIndex: 9999,
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#00796b'
    }
  }}
  title={`Hızlı giriş: ${rememberedUser.email}`}
  onClick={handleQuickLogin}
>
  {rememberedUser.email.charAt(0).toUpperCase()}
</Box>
      )}
    </Box>
  );
}
