import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    CircularProgress
} from '@mui/material';

function Login() {
    console.log("🎮 Login bileşeni yüklendi.");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isLoading: authLoading } = useAuth();

    // ✅ Oturum kontrolü: sayfa açıldığında otomatik kontrol
    useEffect(() => {
        axios.get('/api/session-check', { withCredentials: true })
            .then(res => {
                if (res.data.loggedIn) {
                    console.log('✅ Oturum bulundu, yönlendiriliyor:', res.data.user);
                    navigate('/home'); // veya giriş sonrası gitmesi gereken sayfa
                }
            })
            .catch(err => {
                console.warn('Oturum kontrol hatası:', err.message);
            });
    }, []);

    const handleLogin = async (event) => {
        if (event) event.preventDefault();
        setError('');

        if (!email || !password) {
            setError("⚠️ Lütfen e-posta ve şifreyi girin.");
            return;
        }

        try {
            const loginResult = await login(email, password);
            console.log('Login başarılı:', loginResult);
            navigate('/home', { replace: true });
        } catch (err) {
            console.error('Login hatası:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Giriş sırasında bir hata oluştu.');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
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
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    color: '#fff',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <Typography
                    variant="h3"
                    align="center"
                    sx={{
                        fontFamily: 'Orbitron, sans-serif',
                        fontWeight: 'bold',
                        background: 'linear-gradient(90deg, #ff005c, #ffa700)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2
                    }}
                >
                    GameCenter
                </Typography>

                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={authLoading}
                    InputLabelProps={{ sx: { color: '#ccc' } }}
                    InputProps={{
                        sx: {
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#ffa700' },
                            '&.Mui-focused fieldset': { borderColor: '#ff005c' },
                        },
                    }}
                />
                <TextField
                    label="Şifre"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={authLoading}
                    InputLabelProps={{ sx: { color: '#ccc' } }}
                    InputProps={{
                        sx: {
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#ffa700' },
                            '&.Mui-focused fieldset': { borderColor: '#ff005c' },
                        },
                    }}
                />

                {error && (
                    <Typography color="error" sx={{ mt: 1, textAlign: 'center', fontSize: '0.875rem' }}>
                        {error}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={authLoading}
                    sx={{ mt: 2, height: 48, fontSize: '1rem' }}
                >
                    {authLoading ? <CircularProgress size={24} color="inherit" /> : '🎮 Giriş Yap'}
                </Button>
            </Paper>
        </Box>
    );
}

export default Login;
