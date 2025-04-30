import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // <<<--- axios'u import et
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  CircularProgress,
  Alert, // <<<--- Hata mesajı için Alert ekle
  List, ListItem, ListItemText, // <<<--- Lobileri listelemek için
  Divider, // <<<--- Ayırıcı
  IconButton // <<<--- Lobi ikonları için (opsiyonel)
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock'; // <<<--- Özel lobi ikonu
import EventIcon from '@mui/icons-material/Event'; // <<<--- Etkinlik lobi ikonu
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  // AuthContext'ten kullanıcı bilgisini ve ilk yüklenme durumunu alıyoruz.
  // isLoading prop'unu isAuthLoading olarak yeniden adlandırıyoruz ki kendi veri yükleme state'imizle karışmasın.
  const { user, isLoading: isAuthLoading } = useAuth();

  // --- Sayfa İçin State'ler ---
  const [games, setGames] = useState([]); // Oyun listesi için state
  const [lobbies, setLobbies] = useState([]); // Lobi listesi için state
  const [loadingData, setLoadingData] = useState(false); // Oyun/Lobi verisi yüklenme durumu
  const [error, setError] = useState(null); // Veri çekme veya diğer hatalar için state

  // --- Veri Çekme Effect'i ---
  useEffect(() => {
    // AuthContext'in yüklemesi bittiyse VE kullanıcı giriş yapmışsa verileri çekmeyi dene
    if (!isAuthLoading && user) {
      const fetchData = async () => {
        setLoadingData(true); // Veri çekme başladı
        setError(null); // Önceki hataları temizle
        try {
          console.log("Home.js: Veri çekme işlemi başlıyor...");
          // Backend'deki API endpoint'lerine istek atıyoruz
          // Proxy ayarı sayesinde tam URL yazmaya gerek yok, sadece /api/... yeterli
          // Session cookie'sinin gönderilmesi için withCredentials: true önemli!
          const [gamesResponse, lobbiesResponse] = await Promise.all([
              axios.get('/api/games', { withCredentials: true }),
              axios.get('/api/lobbies', { withCredentials: true })
          ]);

          setGames(gamesResponse.data); // Oyunları state'e kaydet
          setLobbies(lobbiesResponse.data); // Lobileri state'e kaydet
          console.log("Oyunlar ve Lobiler başarıyla çekildi.");

        } catch (err) {
          // Hata durumunda
          console.error("Home.js: Veri çekme hatası:", err.response ? err.response.data : err.message);
          setError(err.response?.data?.message || "Veriler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
          // Eğer yetkilendirme hatası (401) ise, kullanıcıyı login'e yönlendir (ProtectedRoute zaten yapar ama ek kontrol)
          if (err.response?.status === 401) {
             console.error("Home.js: Yetki hatası (401), login'e yönlendiriliyor.");
             // Belki logout yapıp yönlendirmek daha iyi olabilir:
             // logout().then(() => navigate('/login', { replace: true }));
             navigate('/login', { replace: true });
          }
        } finally {
          setLoadingData(false); // Veri çekme işlemi bitti (başarılı veya hatalı)
        }
      };
      fetchData(); // Asenkron fonksiyonu çalıştır
    }
    // Auth yüklemesi bitmiş AMA kullanıcı yoksa, login'e yönlendir (ProtectedRoute bunu zaten yapmalı)
    else if (!isAuthLoading && !user) {
       console.log("Home.js (veri çekme effect): Kullanıcı yok veya Auth yükleniyor, login'e yönlendiriliyor.");
       navigate('/login', { replace: true });
    }
  // Bu effect, AuthContext'in yüklenme durumu veya kullanıcı bilgisi değiştiğinde tekrar çalışır.
  }, [user, isAuthLoading, navigate]);


  // --- Auth Yükleniyor Ekranı ---
  // Eğer AuthContext hala ilk oturum kontrolünü yapıyorsa, bir yükleniyor ekranı göster
  if (isAuthLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0f2027' }}>
        <CircularProgress color="info"/>
        <Typography sx={{ ml: 2, color: 'white' }}>Oturum kontrol ediliyor...</Typography>
      </Box>
    );
  }

  // --- Ana Render Kısmı ---
  // Buraya geldiysek, Auth yüklemesi bitmiş ve kullanıcı giriş yapmış demektir.
  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)', // Gradient yönü değişti
          minHeight: 'calc(100vh - 64px)', // Navbar yüksekliği kadar eksilttik
          padding: { xs: 2, sm: 3, md: 4 }, // Farklı ekran boyutları için padding
          color: 'white',
        }}
      >
        {/* Hata Mesajı Gösterme Alanı */}
        {error && <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(255, 179, 0, 0.1)', color: '#ffb300' }}>{error}</Alert>}

        {/* Veri Yükleniyor Göstergesi (Oyunlar/Lobiler için) */}
        {loadingData && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress color="inherit" />
            <Typography sx={{ ml: 2 }}>Oyunlar ve Lobiler yükleniyor...</Typography>
          </Box>
        )}

        {/* Veri yüklendiyse ve hata yoksa içeriği göster */}
        {!loadingData && !error && (
          <>
            {/* Sayfa Başlığı ve Lobi Butonu */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, borderBottom: '1px solid rgba(255, 255, 255, 0.2)', pb: 2 }}>
               <Typography variant="h4" sx={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
                 Ana Ekran
               </Typography>
               <Button
                 variant="contained"
                 color="secondary" // Tema rengi
                 size="large"
                //  onClick={() => { /* TODO: Lobi oluşturma modalını aç */ }}
                 sx={{ fontWeight: 'bold' }}
               >
                 Yeni Lobi Oluştur
               </Button>
            </Box>

            {/* Oyunlar Bölümü */}
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', mb: 2, color:'#92fe9d' }}>
              Oyunlar
            </Typography>
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {games.length > 0 ? (
                games.map((game) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={game.id}> {/* Responsive grid */}
                    <Card
                      sx={{
                        height: '100%', // Grid item'ı kadar uzasın
                        display: 'flex', flexDirection: 'column',
                        borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)', // Hafif şeffaf beyaz
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(0, 201, 255, 0.4)' },
                        color: '#1c1c1c' // İç yazı rengi
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={game.image || '/placeholder.png'}
                        alt={game.name}
                        sx={{ height: 140, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1rem', flexGrow: 1 }}>
                          {game.name}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/game/${game.id}`)}
                          sx={{ mt: 'auto', background: 'linear-gradient(90deg, #00c9ff, #92fe9d)', color: '#1c1c1c', fontWeight: 'bold' }}
                        >
                          Detaylar
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
               ) : (
                  <Typography sx={{ width: '100%', textAlign: 'center', color: '#ccc', p: 3 }}>Hiç oyun bulunamadı.</Typography>
               )}
            </Grid>

            <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

            {/* Aktif Lobiler Bölümü */}
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', mb: 2, color:'#ffa700' }}>
              Aktif Lobiler
            </Typography>
             {lobbies.length > 0 ? (
                <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.4)', borderRadius: 2, p: { xs: 1, sm: 2 } }}>
                  {lobbies.map((lobby, index) => (
                    <React.Fragment key={lobby.id}>
                      <ListItem
                        secondaryAction={
                          <Button variant="contained" size="small" onClick={() => navigate(`/lobby/${lobby.id}`)} sx={{ bgcolor: '#ffa700', '&:hover': { bgcolor: '#ff8f00'} }}>
                             Katıl
                          </Button>
                        }
                        sx={{ py: 1.5 }} // Liste elemanı yüksekliği
                      >
                        <ListItemText
                          primary={
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               {lobby.name}
                               {lobby.isPrivate && <LockIcon fontSize="small" sx={{ color: '#ccc' }} />}
                               {lobby.isEvent && <EventIcon fontSize="small" sx={{ color: '#92fe9d' }} />}
                             </Box>
                          }
                          secondary={`Oyun: ${lobby.game} | Oyuncular: ${lobby.currentPlayers}/${lobby.maxPlayers}`}
                          primaryTypographyProps={{ color: 'white', fontWeight:'bold' }}
                          secondaryTypographyProps={{ color: '#bdbdbd' }} // Biraz daha açık gri
                        />
                      </ListItem>
                      {index < lobbies.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />}
                    </React.Fragment>
                  ))}
                </List>
            ) : (
                <Typography sx={{ textAlign: 'center', color: '#ccc', mt: 3 }}>Şu anda aktif lobi bulunmuyor.</Typography>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default Home;