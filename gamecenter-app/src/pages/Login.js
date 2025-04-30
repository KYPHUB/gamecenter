import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Kendi hook'umuzu import ettik
// import axios from 'axios'; // Buna artık burada gerek yok
import {
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    CircularProgress
} from '@mui/material';
// import { LoadingButton } from '@mui/lab'; // Opsiyonel: Eğer @mui/lab kuruluysa

function Login() {
    console.log("🎮 Login bileşeni yüklendi.");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const [loading, setLoading] = useState(false); // Bu state'e artık ihtiyacımız yok
    const navigate = useNavigate();
    // Context'ten login fonksiyonunu ve isLoading durumunu (authLoading olarak) alıyoruz:
    const { login, isLoading: authLoading } = useAuth();

    const handleLogin = async (event) => {
        if (event) event.preventDefault(); // Form gönderimini engelle
        setError(''); // Hataları temizle

        // Alanların boş olup olmadığını kontrol et
        if (!email || !password) {
             setError("⚠️ Lütfen e-posta ve şifreyi girin.");
             return; // Fonksiyondan çık
        }

        try {
            // Doğrudan Context'teki login fonksiyonunu çağırıyoruz
            const loginResult = await login(email, password);

            console.log('Login sayfası: Context login başarılı:', loginResult);

            // Başarılı login sonrası yönlendirme
            // BURAYI KONTROL ET: Yönlendirilecek doğru sayfa yolu nedir?
            // Ödevde '/dashboard/app' gibi bir yol olabilir mi?
            navigate('/home', { replace: true }); // Şimdilik /home varsayalım

        } catch (err) {
            // Context'ten fırlatılan hatayı yakalıyoruz
            console.error('Login sayfası: Context login hatası:', err.response ? err.response.data : err.message);
            // Backend'den gelen veya genel hata mesajını göster
            setError(err.response?.data?.message || 'Giriş sırasında bir hata oluştu.');
        }
        // finally bloğuna gerek kalmadı, yüklenme durumu Context'te yönetiliyor.
    };

    return (
        // Form gönderimi için Box'ı form component'i yapıyoruz
        <Box
            component="form"
            onSubmit={handleLogin} // Enter tuşuyla da çalışır
            sx={{
                backgroundImage: 'url("/bg.jpg")', // public klasöründe bg.jpg olmalı
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
                    backdropFilter: 'blur(10px)', // Arka planı bulanıklaştır
                    backgroundColor: 'rgba(0, 0, 0, 0.65)', // Arka plan rengi ve şeffaflığı
                    color: '#fff', // Yazı rengi
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // Gölge
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2 // İç elemanlar arası boşluk
                }}
            >
                {/* Oyun Merkezi Başlığı */}
                <Typography
                    variant="h3"
                    align="center"
                    sx={{
                        fontFamily: 'Orbitron, sans-serif', // Fontun yüklü olduğundan emin ol
                        fontWeight: 'bold',
                        background: 'linear-gradient(90deg, #ff005c, #ffa700)', // Gradient renk
                        WebkitBackgroundClip: 'text', // Yazıyı maskele
                        WebkitTextFillColor: 'transparent', // Yazı rengini şeffaf yap
                        mb: 2 // Alt boşluk
                    }}
                >
                    GameCenter
                </Typography>

                {/* Email Input Alanı */}
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email" // Input tipini email yap
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={authLoading} // Context'ten gelen yüklenme durumu
                    InputLabelProps={{ sx: { color: '#ccc' } }} // Label rengi
                    InputProps={{
                        sx: { color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' } } // Yazı ve çerçeve rengi
                    }}
                    sx={{ // Hover ve focus stilleri
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#ffa700' },
                            '&.Mui-focused fieldset': { borderColor: '#ff005c' },
                        },
                    }}
                />
                {/* Şifre Input Alanı */}
                <TextField
                    label="Şifre"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={authLoading} // Context'ten gelen yüklenme durumu
                    InputLabelProps={{ sx: { color: '#ccc' } }}
                    InputProps={{
                         sx: { color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' } }
                    }}
                     sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#ffa700' },
                            '&.Mui-focused fieldset': { borderColor: '#ff005c' },
                        },
                    }}
                />

                {/* Hata Mesajı Gösterme Alanı */}
                {error && (
                    <Typography color="error" sx={{ mt: 1, textAlign: 'center', fontSize: '0.875rem' }}>
                        {error}
                    </Typography>
                )}

                {/* Giriş Yap Butonu */}
                <Button
                    type="submit" // Formu göndermek için
                    variant="contained"
                    color="primary" // Temadan gelen ana rengi kullanır
                    fullWidth
                    disabled={authLoading} // Context'ten gelen yüklenme durumu
                    sx={{ mt: 2, height: 48, fontSize: '1rem' }} // Stil ayarları
                >
                    {/* Yükleniyorsa spinner, değilse yazı ve ikon */}
                    {authLoading ? <CircularProgress size={24} color="inherit" /> : '🎮 Giriş Yap'}
                </Button>

                 {/* Alternatif LoadingButton kullanımı (Eğer @mui/lab kuruluysa):
                 import { LoadingButton } from '@mui/lab';
                 <LoadingButton
                    type="submit"
                    loading={authLoading} // Direkt authLoading prop'unu kullanır
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, height: 48, fontSize: '1rem' }}
                 >
                    <span>🎮 Giriş Yap</span> // loadingIndicator'ı özelleştirebilirsin
                 </LoadingButton>
                 */}

            </Paper>
        </Box>
    );
}

export default Login;