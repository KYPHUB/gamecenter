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
import SoundButton from '../components/SoundButton';
import SoundSwitch from '../components/SoundSwitch';
import NotifySound from '../components/NotifySound'
import { useTheme } from "@mui/material/styles";
import { useTranslation } from 'react-i18next';
import { useSocket } from '../context/WebSocketContext';





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
  const muiTheme = useTheme();
  const { t } = useTranslation();
  const socket = useSocket();

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

   useEffect(() => {
  if (!socket || !lobby) return;

  const handlePlayerJoin = ({ lobbyId, email }) => {
  if (lobbyId === lobby.id) {
    setLobby(prev => {
      if (prev.participants.includes(email)) return prev;
      return {
        ...prev,
        participants: [...prev.participants, email],
        currentPlayers: prev.currentPlayers + 1
      };
    });
  }
};

  const handlePlayerLeave = ({ lobbyId, email }) => {
  if (lobbyId === lobby.id) {
    setLobby(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== email),
      currentPlayers: Math.max(0, prev.participants.length - 1)
    }));
  }
};

  const handleLobbyUpdate = (updated) => {
    if (updated.id === lobby.id) setLobby(updated);
  };

  const handleLobbyDelete = (id) => {
    if (id === lobby.id) navigate('/home');
  };

  socket.on('player:join', handlePlayerJoin);
  socket.on('player:leave', handlePlayerLeave);
  socket.on('lobby:update', handleLobbyUpdate);
  socket.on('lobby:delete', handleLobbyDelete);

  return () => {
    socket.off('player:join', handlePlayerJoin);
    socket.off('player:leave', handlePlayerLeave);
    socket.off('lobby:update', handleLobbyUpdate);
    socket.off('lobby:delete', handleLobbyDelete);
  };
}, [socket, lobby, navigate]);



  const handleCopyLink = () => {
  const url = `${window.location.origin}/lobby/${lobby.id}`;
  navigator.clipboard.writeText(url)
    .then(() => setCopySuccess(true))
    .catch(() => alert('Bağlantı kopyalanamadı'));
};

const handleUpdateLobby = async () => {
  const {
    lobbyName,
    gameId,
    maxPlayers,
    isPrivate,
    password,
    isEvent,
    eventStartTime,
    eventEndTime,
  } = editForm;

  /* === doğrulamalar === */
  if (!lobbyName.trim() || !gameId) {
    alert(t('lobbyName') + ' & ' + t('selectGame') + ' ' + t('errorOccurred'));
    return;
  }
  if (maxPlayers < lobby.currentPlayers) {
    alert(`${t('players')}: ${lobby.currentPlayers} > ${maxPlayers}`);
    return;
  }
  if (isPrivate && (!password || password.trim() === '')) {
    alert(t('passwordRequired'));
    return;
  }
  if (isEvent) {
    const s = new Date(eventStartTime);
    const e = new Date(eventEndTime);
    if (isNaN(s) || isNaN(e) || e <= s) {
      alert(t('errorOccurred'));
      return;
    }
  }

  /* === istek === */
  setUpdateLoading(true);
  try {
    const { data } = await axios.put(
      `/api/lobbies/${lobby.id}`,
      editForm,
      { withCredentials: true }
    );
    setLobby(data.lobby);
    setUpdateSnack(true);
    setEditOpen(false);
  } catch (err) {
    alert(t('errorOccurred'));
  } finally {
    setUpdateLoading(false);
  }
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
  if (!socket || !lobbyId) return;

  const handleStart = () => {
    console.log('🚀 tombala:start alındı → oyuna yönleniyor...');
    navigate(`/tombala/play/${lobbyId}`);
  };

  socket.on('tombala:start', handleStart);
  return () => socket.off('tombala:start', handleStart);
}, [socket, lobbyId, navigate]);


 useEffect(() => {
  if (copySuccess) NotifySound();
}, [copySuccess]);

useEffect(() => {
  if (deleteSnack) NotifySound();
}, [deleteSnack]);

useEffect(() => {
  if (updateSnack) NotifySound();
}, [updateSnack]);


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

useEffect(() => {
  if (!socket || !lobbyId) return;
  console.log('📡 Katılımcı WS ile lobby\'e katılıyor:', lobbyId);
  socket.emit('join-lobby', lobbyId);
}, [socket, lobbyId])


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

    setLobby(prev => {
      if (prev.participants.includes(user.email)) return prev;
      return {
        ...prev,
        participants: [...prev.participants, user.email],
        currentPlayers: prev.currentPlayers + 1,
      };
    });

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
        background: muiTheme.palette.mode === 'dark'
          ? 'linear-gradient(to right, #0f2027, #203a43, #2c5364)'
          : 'linear-gradient(to right, #e0f7fa, #f1f8e9, #ffffff)',
        minHeight: 'calc(100vh - 64px)',
        p: { xs: 2, sm: 4, md: 6 },
        color: muiTheme.palette.text.primary,
      }}
    >
      {/* ======= Başlık ve Oyun Bilgisi ======= */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontFamily: 'Orbitron, sans-serif',
          borderBottom: `1px solid ${muiTheme.palette.warning.main}`,
          pb: 1,
          mb: 3,
        }}
      >
        {lobby.name}
      </Typography>

      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: muiTheme.palette.text.secondary, mb: 4 }}
      >
        {t('game')}: {getGameName(lobby.game)}
      </Typography>

      {/* ======= Lobi Bağlantısı ======= */}
      <Box
        sx={{
          mt: 4,
          p: 2,
          borderRadius: 2,
          background: muiTheme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.05)'
            : '#f5f5f5',
        }}
      >
        <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
          🔗 {t('lobbyLink')}:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            sx={{ wordBreak: 'break-all', color: muiTheme.palette.primary.main }}
          >
            {`${window.location.origin}/lobby/${lobby.id}`}
          </Typography>
          <IconButton onClick={handleCopyLink} color="primary">
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Box>

      {/* ======= Kopyalandı Snackbar ======= */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message={t('linkCopied')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* ======= Özet Bilgiler Grid ======= */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{t('players')}:</Typography>
          <Typography>
            {lobby.currentPlayers} / {lobby.maxPlayers}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{t('status')}:</Typography>
          <Typography>
            {lobby.isPrivate ? `🔒 ${t('private')}` : t('public')}
            {lobby.isEvent ? ` 📅 (${t('eventLobbyLabel')})` : ''}
          </Typography>
        </Grid>
  {creatorLeftAt && (
    <Grid item xs={12}>
      <Typography variant="h6">Lobi otomatik kapanacak:</Typography>
      <Countdown target={new Date(creatorLeftAt).getTime() + 8 * 60 * 60 * 1000} />
    </Grid>
  )}

        {lobby.isEvent && lobby.eventEndTime && (
          <Grid item xs={12}>
            <Typography variant="h6">{t('eventEndsIn')}:</Typography>
            <Countdown target={lobby.eventEndTime} />
          </Grid>
        )}
      </Grid>

      {/* ======= Kurucu & Katılımcılar ======= */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        {t('owner')}:
      </Typography>
      <Typography sx={{ mb: 2 }}>
        👑 {lobby.createdBy.split('@')[0]}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {t('participants')}:
      </Typography>

      <List
        sx={{
          bgcolor: muiTheme.palette.mode === 'dark'
            ? 'rgba(0,0,0,0.2)'
            : '#f9f9f9',
          borderRadius: 1,
        }}
      >
        {participants.includes(lobby.createdBy) && (
          <ListItem>
            <ListItemText primary={lobby.createdBy.split('@')[0]} />
          </ListItem>
        )}

        {otherParticipants.length > 0 ? (
          otherParticipants.map((p, i) => (
            <ListItem key={i}>
              <ListItemText primary={p.split('@')[0]} />
            </ListItem>
          ))
        ) : !participants.includes(lobby.createdBy) ? (
          <ListItem>
            <ListItemText primary={t('noOtherParticipants')} />
          </ListItem>
        ) : null}
      </List>
       <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {showJoin && (
          lobby.isPrivate ? (
            /* 🔒 Şifre Prompt-u */
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: muiTheme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : '#f3f3f3',
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
                🔒 {t('passwordRequired')}
              </Typography>

              <Box sx={{ width: '100%' }}>
                <TextField
                  type="password"
                  fullWidth
                  placeholder={t('enterPassword')}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </Box>

              {joinError && (
                <Typography color="error" sx={{ fontSize: '0.9rem' }}>
                  {joinError}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <SoundButton variant="contained" onClick={joinLobby}>
                  ✅ {t('confirm')}
                </SoundButton>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPasswordInput('');
                  }}
                >
                  {t('cancel')}
                </Button>
              </Box>
            </Box>
          ) : (
            <SoundButton variant="contained" onClick={joinLobby}>
              ✅ {t('joinLobby')}
            </SoundButton>
          )
        )}

        {showLeave && (
          <SoundButton
            variant="outlined"
            color="error"
            onClick={leaveLobby}
          >
            ❌ {t('leaveLobby')}
          </SoundButton>
        )}

        {isOwner && (
          <>
            <SoundButton
              variant="contained"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              🗑️ {t('deleteLobby')}
            </SoundButton>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                setEditForm({
                  lobbyName: lobby.name,
                  gameId: lobby.gameId,
                  maxPlayers: lobby.maxPlayers,
                  isPrivate: lobby.isPrivate,
                  password: lobby.password || '',
                  isEvent: lobby.isEvent,
                  eventStartTime: lobby.eventStartTime?.slice(0, 16) || '',
                  eventEndTime: lobby.eventEndTime?.slice(0, 16) || '',
                });
                setEditOpen(true);
              }}
            >
              ✏️ {t('editLobby')}
            </Button>
          </>
        )}
      </Box>

      {/* ======= “Oyunu Başlat” Placeholder ======= */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" size="large" color="success" disabled>
          {t('startGame')}
        </Button>
      </Box>

      {/* ======= Silme Dialog ======= */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('confirmDeleteLobby')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('deleteConfirmationMessage', { lobbyName: lobby.name })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            {t('cancel')}
          </Button>
          <SoundButton
            variant="contained"
            color="error"
            disabled={deleteLoading}
            onClick={handleDeleteLobby}
          >
            {deleteLoading ? t('deleting') : t('delete')}
          </SoundButton>
        </DialogActions>
      </Dialog>

      {isOwner && lobby.gameId === 'tombala' && (
  <Button
    variant="contained"
    size="large"
    color="success"
    onClick={() => navigate(`/tombala/menu/${lobby.id}`)}
  >
    Oyunu Başlat
  </Button>
)}


      {/* ======= Düzenleme Dialog ======= */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('editLobby')}</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          {/*  --- Alanlar --- */}
          {/* Lobi adı */}
          <TextField
            label={t('lobbyName')}
            fullWidth
            value={editForm.lobbyName}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, lobbyName: e.target.value }))
            }
          />
          {/* Oyun seçimi */}
          <FormControl fullWidth>
            <InputLabel>{t('selectGame')}</InputLabel>
            <Select
              label={t('selectGame')}
              value={editForm.gameId}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, gameId: e.target.value }))
              }
            >
              {availableGames.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Oyuncu sayısı */}
          <TextField
            label={t('playerCount')}
            type="number"
            inputProps={{ min: 2, max: 10 }}
            fullWidth
            value={editForm.maxPlayers}
            onChange={(e) =>
              setEditForm((p) => ({
                ...p,
                maxPlayers: parseInt(e.target.value || '2', 10),
              }))
            }
          />
          {/* Özel lobi anahtarı */}
          <FormControlLabel
            control={
              <SoundSwitch
                checked={editForm.isPrivate}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, isPrivate: e.target.checked }))
                }
              />
            }
            label={`🔒 ${t('privateLobby')}`}
          />
          {editForm.isPrivate && (
            <TextField
              label={t('lobbyPassword')}
              type="password"
              fullWidth
              value={editForm.password}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, password: e.target.value }))
              }
            />
          )}
          {/* Etkinlik anahtarı */}
          <FormControlLabel
            control={
              <SoundSwitch
                checked={editForm.isEvent}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, isEvent: e.target.checked }))
                }
              />
            }
            label={`📅 ${t('eventLobby')}`}
          />
          {editForm.isEvent && (
            <>
              <TextField
                label={t('startTime')}
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={editForm.eventStartTime}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    eventStartTime: e.target.value,
                  }))
                }
              />
              <TextField
                label={t('endTime')}
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={editForm.eventEndTime}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    eventEndTime: e.target.value,
                  }))
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            {t('cancel')}
          </Button>
          <SoundButton
            variant="contained"
            color="success"
            disabled={updateLoading}
            onClick={handleUpdateLobby}
          >
            {updateLoading ? t('saving') : t('save')}
          </SoundButton>
        </DialogActions>
      </Dialog>

      {/* ======= Snackbar’lar ======= */}
      <Snackbar
        open={deleteSnack}
        autoHideDuration={3000}
        onClose={() => setDeleteSnack(false)}
        message={t('deleteSuccess')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Snackbar
        open={updateSnack}
        autoHideDuration={3000}
        onClose={() => setUpdateSnack(false)}
        message={t('updateSuccess')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  </>
);
}

export default LobbyDetail