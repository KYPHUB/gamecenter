import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Grid'i buraya ekledik:
import { Box, Typography, List, ListItem, CircularProgress, Alert, ListItemText, Divider, Button, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios'; // axios import edildi
import { useAuth } from '../context/AuthContext'; // Auth context (gerekirse)

function LobbyDetail() {
  const { id: lobbyId } = useParams(); // URL'den lobi ID'sini al
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth(); // Auth durumu (opsiyonel kontrol için)

  // --- State'ler ---
  const [lobby, setLobby] = useState(null); // Lobi verisi için state
  const [loading, setLoading] = useState(true); // Veri yükleme durumu
  const [error, setError] = useState(null); // Hata durumu

  // --- Veri Çekme Effect'i ---
  useEffect(() => {
    // Sadece Auth yüklemesi bittikten sonra ve ID varsa çalıştır
    if (!isAuthLoading && lobbyId) {
       const fetchLobbyDetail = async () => {
         setLoading(true);
         setError(null);
         try {
           console.log(`LobbyDetail: Lobi detayı çekiliyor - ID: ${lobbyId}`);
           // Backend'deki yeni endpoint'e istek atıyoruz
           const response = await axios.get(`/api/lobbies/${lobbyId}`, { withCredentials: true });
           setLobby(response.data); // Gelen lobi verisini state'e ata
           console.log("Lobi detayı başarıyla çekildi:", response.data);
         } catch (err) {
           console.error("LobbyDetail: Lobi çekme hatası:", err.response ? err.response.data : err.message);
           setError(err.response?.data?.message || "Lobi bilgileri yüklenirken bir hata oluştu.");
           setLobby(null); // Hata durumunda lobi verisini temizle
           // Yetki hatası varsa login'e yönlendir
           if (err.response?.status === 401) {
               navigate('/login', { replace: true });
           }
           // Eğer 404 hatasıysa (lobi bulunamadıysa), error state'i zaten mesajı gösterecektir.
         } finally {
           setLoading(false); // Yükleme tamamlandı
         }
       };
       fetchLobbyDetail();
    } else if (!isAuthLoading && !user) {
        // Kullanıcı girişi yoksa login'e yönlendir
        navigate('/login', { replace: true });
    }
  // Effect'in çalışmasını tetikleyecek bağımlılıklar: lobiId ve Auth durumu
  }, [lobbyId, navigate, user, isAuthLoading]);


  // === Render Koşulları ===

  // 1. Auth veya Veri yükleniyorsa:
  if (loading || isAuthLoading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', bgcolor: '#0f2027' }}>
          <CircularProgress color="info"/>
          <Typography sx={{ ml: 2, color: 'white' }}>
            {isAuthLoading ? 'Oturum kontrol ediliyor...' : 'Lobi bilgileri yükleniyor...'}
          </Typography>
        </Box>
      </>
    );
  }

  // 2. Yükleme bitti ama hata varsa veya lobi bulunamadıysa:
  if (error || !lobby) {
    return (
      <>
        <Navbar />
        <Box sx={{ padding: 4, color: 'white', background: '#121212', minHeight: 'calc(100vh - 64px)' }}>
          <Alert severity="error">{error || 'Lobi bulunamadı.'}</Alert>
           <Button onClick={() => navigate('/home')} sx={{ mt: 2 }} variant="outlined" color="inherit">Ana Sayfaya Dön</Button>
        </Box>
      </>
    );
  }

  // 3. Yükleme bitti, hata yok ve lobi bulunduysa: Lobi Detaylarını Göster
  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
          minHeight: 'calc(100vh - 64px)',
          padding: { xs: 2, sm: 4, md: 6 }, // Responsive padding
          color: 'white',
        }}
      >
        {/* Lobi Adı ve Oyun */}
        <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', borderBottom: '1px solid #ffa700', pb:1, mb:3 }}>
          {lobby.name}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: '#ccc', mb: 4 }}>
          Oyun: {lobby.game}
        </Typography>

        {/* Lobi Bilgileri */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h6">Oyuncular:</Typography>
                <Typography>{lobby.currentPlayers} / {lobby.maxPlayers}</Typography>
            </Grid>
             <Grid item xs={12} sm={6}>
                <Typography variant="h6">Durum:</Typography>
                <Typography>{lobby.isPrivate ? '🔒 Özel Lobi' : 'Herkese Açık'}{lobby.isEvent ? ' ✨ (Etkinlik Lobisi)' : ''}</Typography>
            </Grid>
            {/* Örnek: Diğer bilgiler eklenebilir
             <Grid item xs={12} sm={6}>
                <Typography variant="h6">Oluşturan:</Typography>
                <Typography>{lobby.createdBy || 'Bilinmiyor'}</Typography>
             </Grid>
            */}
             {lobby.isEvent && lobby.eventEndTime && (
                <Grid item xs={12}>
                    <Typography variant="h6">Etkinlik Bitiş:</Typography>
                    <Typography>{new Date(lobby.eventEndTime).toLocaleString('tr-TR')}</Typography>
                </Grid>
             )}
        </Grid>

        {/* Katılan Oyuncular Listesi (Bu bilgi dummyLobbies'de yok, şimdilik statik) */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Katılan Oyuncular:
        </Typography>
        <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
           {/* Gerçek uygulamada bu liste backend'den veya websocket ile güncellenir */}
           <ListItem><ListItemText primary="Oyuncu 1 (Siz)" /></ListItem>
           <ListItem><ListItemText primary="Oyuncu 2" /></ListItem>
           {lobby.currentPlayers > 2 && <ListItem><ListItemText primary={`... ve ${lobby.currentPlayers - 2} diğer oyuncu`} /></ListItem>}
           {lobby.currentPlayers === 0 && <ListItem><ListItemText primary="Henüz katılan yok."/></ListItem>}
        </List>

        {/* Oyun Başlatma Butonu (Opsiyonel) */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" size="large" color="success" /* onClick={handleStartGame} */>
                Oyunu Başlat (Yakında)
            </Button>
        </Box>

      </Box>
    </>
  );
}

export default LobbyDetail;