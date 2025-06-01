import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, CircularProgress, Alert,
  ListItemText, Divider, Button, Grid
} from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Countdown from '../components/Countdown';
import { Snackbar, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';




function LobbyDetail() {
  const { id: lobbyId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, verifyToken } = useAuth();

  const [tokenVerified, setTokenVerified] = useState(false);
  const [lobby, setLobby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableGames, setAvailableGames] = useState([]);
  const [isInLobby, setIsInLobby] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [joinError, setJoinError] = useState("");

  const [copySuccess, setCopySuccess] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSnack, setDeleteSnack] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    lobbyName: '',
    gameId: '',
    maxPlayers: 6,
    isPrivate: false,
    password: '',
    isEvent: false,
    eventStartTime: '',
    eventEndTime: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSnack, setUpdateSnack] = useState(false);




  const handleCopyLink = () => {
  const url = `${window.location.origin}/lobby/${lobby.id}`;
  navigator.clipboard.writeText(url)
    .then(() => setCopySuccess(true))
    .catch(() => alert('Bağlantı kopyalanamadı'));
};



  useEffect(() => {
    const check = async () => {
      const valid = await verifyToken();
      if (!valid) {
        navigate('/login', { replace: true });
      } else {
        setTokenVerified(true);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (!isAuthLoading && user && lobbyId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [lobbyRes, gamesRes] = await Promise.all([
            axios.get(`/api/lobbies/${lobbyId}`, { withCredentials: true }),
            axios.get('/api/games', { withCredentials: true })
          ]);
          setLobby(lobbyRes.data);
          setAvailableGames(gamesRes.data);
          setIsInLobby(lobbyRes.data.participants?.includes(user.email));
        } catch (err) {
          console.error("Lobi detayı alınamadı:", err.message);
          setError('Lobi bilgisi yüklenemedi.');
          if (err.response?.status === 401) navigate('/login', { replace: true });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (!isAuthLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [lobbyId, navigate, user, isAuthLoading]);

  const getGameName = (gameId) => {
    return availableGames.find(g => g.id === gameId)?.name || gameId;
  };
  const handleDeleteLobby = async () => {
  if (!lobby) return;
  setDeleteLoading(true);
  try {
    await axios.delete(`/api/lobbies/${lobby.id}`, { withCredentials: true });
    setDeleteSnack(true);
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  } catch (err) {
    console.error('Silme işlemi başarısız:', err);
  } finally {
    setDeleteLoading(false);
    setDeleteDialogOpen(false);
  }
};


  const joinLobby = async () => {
  setJoinError("");

  if (lobby.isPrivate && !passwordInput.trim()) {
    return setJoinError("Şifre gereklidir.");
  }

  try {
    await axios.post(
      `/api/lobbies/${lobbyId}/join`,
      lobby.isPrivate ? { password: passwordInput.trim() } : {},
      { withCredentials: true }
    );
    setIsInLobby(true);
    setLobby(prev => ({
      ...prev,
      participants: [...(prev.participants || []), user.email],
      currentPlayers: prev.currentPlayers + 1,
    }));
    setShowPasswordPrompt(false);
    setPasswordInput("");
  } catch (err) {
    setJoinError("Katılım başarısız. Şifre yanlış olabilir.");
  }
};


  const leaveLobby = async () => {
  try {
    const res = await axios.post(`/api/lobbies/${lobbyId}/leave`, {}, { withCredentials: true });
    setIsInLobby(false);
    setLobby(prev => ({
      ...prev,
      participants: (prev.participants || []).filter(p => p !== user.email),
      currentPlayers: Math.max(0, (prev.participants?.length || 1) - 1),
      creatorLeftAt: res.data.creatorLeftAt || prev.creatorLeftAt  
    }));
  } catch {
    alert('Lobiden ayrılamadın');
  }
};



  if (loading || isAuthLoading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', bgcolor: '#0f2027' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            {isAuthLoading ? 'Oturum kontrol ediliyor...' : 'Lobi bilgileri yükleniyor...'}
          </Typography>
        </Box>
      </>
    );
  }

  if (error || !lobby) {
    return (
      <>
        <Navbar />
        <Box sx={{ padding: 4, color: 'white', background: '#121212', minHeight: 'calc(100vh - 64px)' }}>
          <Alert severity="error">{error || 'Lobi bulunamadı.'}</Alert>
          <Button onClick={() => navigate('/home')} sx={{ mt: 2 }} variant="outlined" color="inherit">
            Ana Sayfaya Dön
          </Button>
        </Box>
      </>
    );
  }

  if (!tokenVerified) return null;

  const currentUser = user?.email || '';
  const isOwner = currentUser === lobby.createdBy;
  const username = currentUser.split('@')[0];
  const participants = lobby.participants || []; 
  const otherParticipants = participants.filter(p => p !== lobby.createdBy);
  const showLeave = participants.includes(currentUser);
  const showJoin = !participants.includes(currentUser) && (!isOwner || (isOwner && !participants.includes(currentUser)));


const creatorLeft = !participants.includes(lobby.createdBy);
const creatorLeftAt = lobby.creatorLeftAt ? new Date(lobby.creatorLeftAt) : null;

const expireTime = lobby.creatorLeftAt
  ? new Date(new Date(lobby.creatorLeftAt).getTime() + 8 * 60 * 60 * 1000)
  : null;
  const shouldShowCountdown = creatorLeftAt !== null;

  const isWithin8Hours = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = now - created;
    return diff < 8 * 60 * 60 * 1000;
  };
  return (
  <>
    <Navbar />
    <Box
      sx={{
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        minHeight: 'calc(100vh - 64px)',
        padding: { xs: 2, sm: 4, md: 6 },
        color: 'white',
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Orbitron, sans-serif', borderBottom: '1px solid #ffa700', pb: 1, mb: 3 }}>
        {lobby.name}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ color: '#ccc', mb: 4 }}>
        Oyun: {getGameName(lobby.game)}
      </Typography>

      <Box sx={{ mt: 4, p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
        <Typography sx={{ mb: 1, fontWeight: 'bold' }}>🔗 Lobi Bağlantısı:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ wordBreak: 'break-all', color: '#90caf9' }}>
            {`${window.location.origin}/lobby/${lobby.id}`}
          </Typography>
          <IconButton onClick={handleCopyLink} color="primary">
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Box>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Bağlantı kopyalandı!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Oyuncular:</Typography>
          <Typography>{lobby.currentPlayers} / {lobby.maxPlayers}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Durum:</Typography>
          <Typography>
            {lobby.isPrivate ? '🔒 Özel Lobi' : 'Herkese Açık'}
            {lobby.isEvent ? ' 📅 (Etkinlik Lobisi)' : ''}
          </Typography>
        </Grid>

        {lobby.isEvent && lobby.eventEndTime && (
          <Grid item xs={12}>
            <Typography variant="h6">Etkinliğin Bitmesine Kalan Süre:</Typography>
            <Countdown target={lobby.eventEndTime} />
          </Grid>
        )}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Kurucu:</Typography>
      <Typography sx={{ mb: 2 }}>👑 {lobby.createdBy.split('@')[0]}</Typography>
            <Typography variant="h6" gutterBottom>Katılımcılar:</Typography>
      <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
        {participants.includes(lobby.createdBy) && (
          <ListItem><ListItemText primary={lobby.createdBy.split('@')[0]} /></ListItem>
        )}
        {otherParticipants.length > 0 ? (
          otherParticipants.map((p, i) => (
            <ListItem key={i}><ListItemText primary={p.split('@')[0]} /></ListItem>
          ))
        ) : !participants.includes(lobby.createdBy) ? (
          <ListItem><ListItemText primary="Başka katılımcı yok." /></ListItem>
        ) : null}
      </List>

      {lobby.creatorLeftAt && (
        <Box sx={{ mt: 5, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.05)', py: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#ffa700' }}>
            Lobi otomatik kapanmasına kalan süre:
          </Typography>
          <Countdown target={expireTime} />
        </Box>
      )}

      <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        {showJoin && (
          lobby.isPrivate ? (
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                maxWidth: 400,
                width: '100%',
              }}
            >
              <Typography variant="h6" sx={{ color: '#ffa700' }}>
                🔒 Bu lobiye katılmak için şifre gerekli
              </Typography>

              <Box sx={{ width: '100%' }}>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Lobi Şifresi"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                  }}
                />
              </Box>

              {joinError && (
                <Typography color="error" sx={{ fontSize: '0.9rem' }}>
                  {joinError}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button onClick={joinLobby} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
                  ✅ Katıl
                </Button>
                <Button onClick={() => { setShowPasswordPrompt(false); setPasswordInput(""); }} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
                  İptal
                </Button>
              </Box>
            </Box>
          ) : (
            <Button variant="contained" color="primary" onClick={joinLobby}>
              ✅ Lobiye Katıl
            </Button>
          )
        )}

        {showLeave && (
          <Button variant="outlined" color="error" onClick={leaveLobby}>
            ❌ Lobiden Ayrıl
          </Button>
        )}

        {isOwner && (
          <>
            <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>
              🗑️ Lobiyi Sil
            </Button>
            <Button variant="contained" color="info" onClick={() => {
              setEditForm({
                lobbyName: lobby.name,
                gameId: lobby.gameId,
                maxPlayers: lobby.maxPlayers,
                isPrivate: lobby.isPrivate,
                password: lobby.password || '',
                isEvent: lobby.isEvent,
                eventStartTime: lobby.eventStartTime?.slice(0, 16) || '',
                eventEndTime: lobby.eventEndTime?.slice(0, 16) || ''
              });
              setEditOpen(true);
            }}>
              ✏️ Düzenle
            </Button>
          </>
        )}
      </Box>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" size="large" color="success" disabled>
          Oyunu Başlat (Yakında)
        </Button>
      </Box>

      {/* Silme Onay Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Lobiyi Sil</DialogTitle>
        <DialogContent>
          <Typography>"{lobby.name}" adlı lobiyi silmek istediğinize emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">İptal</Button>
          <Button onClick={handleDeleteLobby} color="error" variant="contained" disabled={deleteLoading}>
            {deleteLoading ? "Siliniyor..." : "Sil"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Düzenleme Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lobi Bilgilerini Güncelle</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Lobi Adı"
            value={editForm.lobbyName}
            onChange={e => setEditForm(prev => ({ ...prev, lobbyName: e.target.value }))}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Oyun</InputLabel>
            <Select
              value={editForm.gameId}
              onChange={e => setEditForm(prev => ({ ...prev, gameId: e.target.value }))}
              label="Oyun"
            >
              {availableGames.map(g => (
                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Oyuncu Sayısı"
            type="number"
            inputProps={{ min: 2, max: 10 }}
            value={editForm.maxPlayers}
            onChange={e => setEditForm(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={editForm.isPrivate}
                onChange={e => setEditForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
              />
            }
            label="🔒 Özel Lobi"
          />
          {editForm.isPrivate && (
            <TextField
              label="Lobi Şifresi"
              type="password"
              value={editForm.password}
              onChange={e => setEditForm(prev => ({ ...prev, password: e.target.value }))}
              fullWidth
            />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={editForm.isEvent}
                onChange={e => setEditForm(prev => ({ ...prev, isEvent: e.target.checked }))}
              />
            }
            label="📅 Etkinlik Lobisi"
          />
          {editForm.isEvent && (
            <>
              <TextField
                label="Başlangıç Zamanı"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={editForm.eventStartTime}
                onChange={e => setEditForm(prev => ({ ...prev, eventStartTime: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Bitiş Zamanı"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={editForm.eventEndTime}
                onChange={e => setEditForm(prev => ({ ...prev, eventEndTime: e.target.value }))}
                fullWidth
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="inherit">İptal</Button>
          <Button
            variant="contained"
            color="success"
            disabled={updateLoading}
            onClick={async () => {
  const {
    lobbyName,
    gameId,
    maxPlayers,
    isPrivate,
    password,
    isEvent,
    eventStartTime,
    eventEndTime
  } = editForm;

  // Validasyonlar
  if (!lobbyName.trim() || !gameId) {
    alert("Lobi adı ve oyun seçimi zorunludur.");
    return;
  }

  if (maxPlayers < lobby.currentPlayers) {
    alert(`Lobide şu anda ${lobby.currentPlayers} oyuncu var. Oyuncu sayısını azaltamazsınız.`);
    return;
  }

  if (isPrivate && (!password || password.trim() === '')) {
    alert("Şifreli lobilerde şifre boş bırakılamaz.");
    return;
  }

  if (isEvent) {
    const start = new Date(eventStartTime);
    const end = new Date(eventEndTime);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert("Etkinlik tarihleri geçersiz.");
      return;
    }

    if (start < now) {
      alert("Etkinlik başlangıç zamanı geçmişte olamaz.");
      return;
    }

    if (end <= start) {
      alert("Etkinlik bitiş zamanı başlangıçtan sonra olmalıdır.");
      return;
    }
  }

  
  setUpdateLoading(true);
  try {
    const res = await axios.put(`/api/lobbies/${lobby.id}`, editForm, { withCredentials: true });
    setLobby(res.data.lobby);
    setUpdateSnack(true);
    setEditOpen(false);
  } catch {
    alert('Güncelleme başarısız!');
  } finally {
    setUpdateLoading(false);
  }
}}

          >
            {updateLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={deleteSnack}
        autoHideDuration={3000}
        onClose={() => setDeleteSnack(false)}
        message="Lobi silindi"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Snackbar
        open={updateSnack}
        autoHideDuration={3000}
        onClose={() => setUpdateSnack(false)}
        message="Lobi güncellendi"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  </>
);
}

export default LobbyDetail