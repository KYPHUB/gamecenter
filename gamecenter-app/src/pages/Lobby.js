import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List, ListItem, ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Select, MenuItem, FormControl, InputLabel,
  Grid, // Grid düzeni için
  FormControlLabel, // Switch label'ı için
  Switch // Özel lobi için
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
// import { LoadingButton } from '@mui/lab'; // Opsiyonel alternatif

function Lobby() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  // --- State'ler ---
  const [lobbies, setLobbies] = useState([]); // Mevcut lobiler
  const [loadingLobbies, setLoadingLobbies] = useState(true); // Lobileri yükleme durumu
  const [errorLobbies, setErrorLobbies] = useState(null); // Lobi yükleme hatası

  const [lobbyName, setLobbyName] = useState(''); // Yeni lobi adı
  const [creatingLobby, setCreatingLobby] = useState(false); // Lobi oluşturma yükleme durumu
  const [createError, setCreateError] = useState(null); // Lobi oluşturma hatası

  const [availableGames, setAvailableGames] = useState([]); // Seçilebilir oyunlar
  const [loadingGames, setLoadingGames] = useState(true); // Oyunları yükleme durumu
  const [selectedGame, setSelectedGame] = useState(''); // Seçilen oyun ID'si

  const [maxPlayers, setMaxPlayers] = useState(6); // Seçilen oyuncu sayısı
  const [isPrivate, setIsPrivate] = useState(false); // Özel lobi mi?

  // --- Veri Çekme Effect'i (Oyunlar ve Lobiler) ---
  useEffect(() => {
    // Sadece Auth yüklemesi bittiyse ve kullanıcı varsa çalıştır
    if (!isAuthLoading && user) {
      const fetchData = async () => {
        setLoadingLobbies(true);
        setLoadingGames(true);
        setErrorLobbies(null); // Önceki hataları temizle
        try {
          console.log("Lobby.js: Veri çekme işlemi başlıyor...");
          const [lobbiesResponse, gamesResponse] = await Promise.all([
              axios.get('/api/lobbies', { withCredentials: true }),
              axios.get('/api/games', { withCredentials: true })
          ]);
          setLobbies(lobbiesResponse.data);
          setAvailableGames(gamesResponse.data);
          console.log("Lobiler ve Oyunlar başarıyla çekildi.");
        } catch (err) {
          console.error("Lobby.js: Veri çekme hatası:", err.response ? err.response.data : err.message);
          setErrorLobbies(err.response?.data?.message || "Veriler yüklenirken bir hata oluştu.");
           if (err.response?.status === 401) { navigate('/login', { replace: true }); }
        } finally {
          setLoadingLobbies(false);
          setLoadingGames(false);
        }
      };
      fetchData();
    } else if (!isAuthLoading && !user) {
        // Auth yüklemesi bitti ama kullanıcı yoksa login'e yönlendir
        console.log("Lobby.js (veri çekme): Kullanıcı yok, login'e yönlendiriliyor.");
        navigate('/login', { replace: true });
    }
  // Bu effect, Auth durumu veya navigate fonksiyonu değişirse çalışır
  }, [user, isAuthLoading, navigate]);


  // --- Yeni Lobi Oluşturma Fonksiyonu ---
  const handleCreateLobby = async () => {
    setCreateError(null); // Önceki hatayı temizle
    // Form doğrulaması
    if (lobbyName.trim() === '' || selectedGame === '' || !maxPlayers || maxPlayers < 2 || maxPlayers > 6) {
       setCreateError('Lobi adı, Oyun seçimi ve geçerli Oyuncu Sayısı (2-6) zorunludur.');
       return;
    }

    setCreatingLobby(true); // Oluşturma işlemi başladı
    try {
        // Backend'e gönderilecek veri objesi
        const newLobbyData = {
            lobbyName: lobbyName.trim(),
            gameId: selectedGame,
            maxPlayers: parseInt(maxPlayers, 10),
            isPrivate: isPrivate
        };
        console.log("Yeni lobi oluşturma isteği gönderiliyor:", newLobbyData);

        // Backend'e POST isteği
        const response = await axios.post('/api/lobbies', newLobbyData, { withCredentials: true });

        console.log("Yeni lobi başarıyla oluşturuldu (frontend):", response.data.lobby);
        // Lobi listesini güncelle (yeni lobi en başa)
        setLobbies(prevLobbies => [response.data.lobby, ...prevLobbies]);
        // Formu sıfırla
        setLobbyName('');
        setSelectedGame('');
        setMaxPlayers(6);
        setIsPrivate(false);

    } catch (err) {
        console.error("Lobby.js: Lobi oluşturma hatası:", err.response ? err.response.data : err.message);
        setCreateError(err.response?.data?.message || "Lobi oluşturulamadı.");
    } finally {
        setCreatingLobby(false); // Oluşturma işlemi bitti
    }
  };

  // --- Auth Yükleniyor Ekranı ---
  // Eğer AuthContext ilk yüklemeyi yapıyorsa (session kontrolü)
  if (isAuthLoading) {
    return (
        <>
          <Navbar />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', bgcolor: '#0f2027' }}>
            <CircularProgress color="info"/>
            <Typography sx={{ ml: 2, color: 'white' }}>Oturum kontrol ediliyor...</Typography>
          </Box>
        </>
      );
  }

  // --- Ana Render Kısmı ---
  return (
    <>
      <Navbar />
      <Box sx={{ background: 'linear-gradient(to right, #000428, #004e92)', minHeight: 'calc(100vh - 64px)', padding: { xs: 2, md: 4 }, color: 'white', }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', mb:3 }}>
          🎮 Lobi Oluştur & Katıl
        </Typography>

        {/* Yeni Lobi Oluşturma Formu */}
        <Paper sx={{ p: {xs: 2, md: 3}, mb: 4, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Yeni Lobi Oluştur</Typography>
          {/* Oluşturma hatası varsa göster */}
          {createError && <Alert severity="error" sx={{mb: 2}} onClose={() => setCreateError(null)}>{createError}</Alert>}
          <Grid container spacing={2}>
            {/* Lobi Adı Input */}
            <Grid item xs={12}>
              <TextField
                label="Lobi Adı" variant="outlined" fullWidth
                value={lobbyName}
                onChange={(e) => { if (e && e.target) { setLobbyName(e.target.value); } }} // Güvenli onChange
                disabled={creatingLobby || loadingGames}
                sx={{ input: { color: 'white' }, label: { color: '#ccc' } }}
                InputLabelProps={{ style: { color: '#ccc' } }}
                required // HTML5 doğrulama
              />
            </Grid>
            {/* Oyun Seçimi Select */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={creatingLobby || loadingGames} required>
                <InputLabel id="game-select-label" sx={{color: '#ccc'}}>Oyun Seç</InputLabel>
                <Select
                  labelId="game-select-label" value={selectedGame} label="Oyun Seç"
                  onChange={(e) => { if (e && e.target) { setSelectedGame(e.target.value); } }} // Güvenli onChange
                  sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '& .MuiSvgIcon-root': { color: 'white' } }}
                  MenuProps={{ PaperProps: { sx: { bgcolor: '#333', color: 'white' } } }}
                >
                  <MenuItem value="" disabled><em>{loadingGames ? 'Yükleniyor...' : 'Bir oyun seçin'}</em></MenuItem>
                  {availableGames.map((game) => (<MenuItem key={game.id} value={game.id}>{game.name}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            {/* Oyuncu Sayısı Input */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Oyuncu Sayısı" type="number" fullWidth value={maxPlayers}
                onChange={(e) => { // Güvenli onChange ve sınırlama
                  if (e && e.target) {
                    const newValue = e.target.value;
                    let numValue = parseInt(newValue, 10);
                    if (isNaN(numValue)) { numValue = 2; }
                    const clampedValue = Math.max(2, Math.min(6, numValue));
                    setMaxPlayers(clampedValue);
                  }
                }}
                disabled={creatingLobby || loadingGames}
                InputProps={{ inputProps: { min: 2, max: 6 } }}
                sx={{ input: { color: 'white' }, label: {color: '#ccc'} }} InputLabelProps={{ style: { color: '#ccc' } }}
                required
              />
            </Grid>
            {/* Özel Lobi Switch */}
            <Grid item xs={12}>
              <FormControlLabel
                 control={ <Switch checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} disabled={creatingLobby || loadingGames} color="secondary" /> }
                 label="Özel Lobi"
                 sx={{ color: '#ccc' }}
               />
            </Grid>
            {/* Lobi Oluştur Buton */}
            <Grid item xs={12}>
              <Button
                 variant="contained" color="primary" onClick={handleCreateLobby} disabled={creatingLobby || loadingGames} sx={{minWidth: 150, height: 40}}
               >
                {creatingLobby ? <CircularProgress size={24} color="inherit"/> : '➕ Lobi Oluştur'}
              </Button>
               {/* <LoadingButton loading={creatingLobby} ... /> */}
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Aktif Lobiler Listesi */}
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Aktif Lobiler</Typography>
        {loadingLobbies && <Box sx={{display: 'flex', justifyContent:'center', my: 3}}><CircularProgress color="inherit"/></Box>}
        {errorLobbies && <Alert severity="error" sx={{mb: 2}}>{errorLobbies}</Alert>}
        {!loadingLobbies && !errorLobbies && (
             lobbies.length > 0 ? (
                 <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
                     {lobbies.map((lobby, index) => (
                       <React.Fragment key={lobby.id}>
                         <ListItem
                           secondaryAction={ <Button variant="contained" color="success" sx={{ fontWeight: 'bold', color: 'white', px: 3 }} onClick={() => navigate(`/lobby/${lobby.id}`)}>🎮 Katıl</Button> }
                           sx={{ py: 1.5 }}
                         >
                            <ListItemText
                               primary={ <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {lobby.name} {lobby.isPrivate && <LockIcon fontSize="small" sx={{ color: '#ccc' }} />} {lobby.isEvent && <EventIcon fontSize="small" sx={{ color: '#92fe9d' }} />} </Box> }
                               secondary={`Oyun: ${lobby.game} | Oyuncular: ${lobby.currentPlayers}/${lobby.maxPlayers}`}
                               primaryTypographyProps={{ color: 'white', fontWeight:'bold' }}
                               secondaryTypographyProps={{ color: '#bdbdbd' }}
                            />
                         </ListItem>
                         {index < lobbies.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />}
                       </React.Fragment>
                     ))}
                 </List>
             ) : (
                  <Typography sx={{ textAlign: 'center', color: '#ccc', mt: 3 }}>Aktif lobi bulunmuyor.</Typography>
             )
         )}
      </Box>
    </>
  );
}

export default Lobby;