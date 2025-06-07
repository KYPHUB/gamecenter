import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  TextField,
  Snackbar
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SoundButton from '../components/SoundButton';
import SoundSwitch from '../components/SoundSwitch';
import NotifySound from '../components/NotifySound';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../context/WebSocketContext';


function Home() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, verifyToken } = useAuth();
  const [tokenVerified, setTokenVerified] = useState(false);
  const [games, setGames] = useState([]);
  const [lobbies, setLobbies] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  const [lobbyLink, setLobbyLink] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);

  const [lobbyToDelete, setLobbyToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const theme = useTheme();
  const { t } = useTranslation();
  const socket = useSocket(); //

  const visibleLobbies = lobbies.filter(l => !l.status || l.status !== 'closed');

  useEffect(() => {
  if (!socket) return;

  const handleCreate = (l) => setLobbies((p) => [l, ...p]);
  const handleUpdate = (l) => setLobbies((p) => p.map((x) => (x.id === l.id ? l : x)));
  const handleDelete = (id) => setLobbies((p) => p.filter((x) => x.id !== id));

  socket.on('lobby:create', handleCreate);
  socket.on('lobby:update', handleUpdate);
  socket.on('lobby:delete', handleDelete);

  return () => {
    socket.off('lobby:create', handleCreate);
    socket.off('lobby:update', handleUpdate);
    socket.off('lobby:delete', handleDelete);
  };
}, [socket]);


  const isEventSoon = (startDate) => {
    const now = new Date();
    const eventTime = new Date(startDate);
    const diff = eventTime - now;
    return diff <= 24 * 60 * 60 * 1000;
  };

  const handleGoToLobby = () => {
    try {
      const url = new URL(lobbyLink);
      const parts = url.pathname.split('/');
      const lobbyId = parts[parts.length - 1];

      if (!lobbyId || !lobbyId.startsWith('lobby-')) {
        throw new Error();
      }

      navigate(`/lobby/${lobbyId}`);
    } catch {
      setSnackOpen(true);
    }
  };

  const handleDeleteLobby = async () => {
    if (!lobbyToDelete) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/lobbies/${lobbyToDelete.id}`, { withCredentials: true });
      setLobbies(prev => prev.filter(l => l.id !== lobbyToDelete.id));
      setSnackOpen(true);
    } catch (err) {
      console.error(t('errorOccurred'), err.message);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setLobbyToDelete(null);
    }
  };

  useEffect(() => {
    if (snackOpen) {
      NotifySound();
    }
  }, [snackOpen]);

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
  }, [verifyToken, navigate]);

  useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchData = async () => {
        setLoadingData(true);
        setError(null);
        try {
          const [gamesResponse, lobbiesResponse] = await Promise.all([
            axios.get('/api/games', { withCredentials: true }),
            axios.get('/api/lobbies', { withCredentials: true })
          ]);

          setGames(gamesResponse.data);
          setLobbies(lobbiesResponse.data);
        } catch (err) {
          setError(err.response?.data?.message || t('loadingError'));
          if (err.response?.status === 401) {
            navigate('/login', { replace: true });
          }
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    } else if (!isAuthLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isAuthLoading, navigate, t]);

  const handleNewLobbyClick = () => {
    navigate('/lobby');
  };

  if (isAuthLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0f2027' }}>
        <CircularProgress color="info"/>
        <Typography sx={{ ml: 2, color: 'white' }}>{t('loading')}</Typography>
      </Box>
    );
  }

  if (!tokenVerified) return null;

  return (
  <>
    <Navbar />
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        padding: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: 'background 0.3s ease',
      }}
    >
      {/* Lobi Linki Yapıştırma Alanı */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.04)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          label={t('pasteLobbyLink')}
          variant="outlined"
          fullWidth
          value={lobbyLink}
          onChange={(e) => setLobbyLink(e.target.value)}
          InputProps={{ sx: { borderRadius: 3, color: theme.palette.text.primary } }}
          InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
        />
        <SoundButton
          onClick={handleGoToLobby}
          variant="contained"
          sx={{ borderRadius: 3, px: 4 }}
        >
          {t('go')}
        </SoundButton>
      </Box>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message={t('lobbyDeleted')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loadingData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ ml: 2 }}>{t('loadingGamesAndLobbies')}</Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              borderBottom: `1px solid ${theme.palette.divider}`,
              pb: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}
            >
              {t('homeScreen')}
            </Typography>
            <SoundButton
              variant="contained"
              color="secondary"
              size="large"
              sx={{ fontWeight: 'bold' }}
              onClick={handleNewLobbyClick}
            >
              {t('createNewLobby')}
            </SoundButton>
          </Box>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontFamily: 'Orbitron, sans-serif', mb: 2 }}
          >
            {t('games')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {games.length > 0 ? (
              games.map((game) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={game.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 16px ${theme.palette.primary.main}55`,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`http://localhost:5000${game.image}`}
                      alt={game.name}
                      sx={{ height: 140, objectFit: 'cover' }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 'bold', fontSize: '1rem', flexGrow: 1 }}
                      >
                        {game.name}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/game/${game.id}`)}
                        sx={{
                          mt: 'auto',
                          background: 'linear-gradient(90deg, #00c9ff, #92fe9d)',
                          color: '#1c1c1c',
                          fontWeight: 'bold',
                        }}
                      >
                        {t('details')}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  color: theme.palette.text.secondary,
                  p: 3,
                }}
              >
                {t('noGamesFound')}
              </Typography>
            )}
          </Grid>

          <Divider sx={{ my: 4, borderColor: theme.palette.divider }} />

          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontFamily: 'Orbitron, sans-serif', mb: 2 }}
          >
            {t('activeLobbies')}
          </Typography>

          {visibleLobbies.length > 0 ? (
            <List
              sx={{
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                borderRadius: 2,
                p: { xs: 1, sm: 2 },
              }}
            >
              {visibleLobbies.map((lobby, index) => (
                <React.Fragment key={lobby.id}>
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <SoundButton
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/lobby/${lobby.id}`)}
                          sx={{ bgcolor: '#ffa700', '&:hover': { bgcolor: '#ff8f00' } }}
                        >
                          {t('join')}
                        </SoundButton>
                        {lobby.createdBy === user?.email && (
                          <IconButton
                            onClick={() => {
                              setLobbyToDelete(lobby);
                              setDeleteDialogOpen(true);
                            }}
                            sx={{ color: '#ff1744' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    }
                    sx={{ py: 1.5 }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {lobby.name}
                          {lobby.isPrivate && (
                            <LockIcon
                              fontSize="small"
                              sx={{ color: theme.palette.text.secondary }}
                            />
                          )}
                          {lobby.isEvent && (
                            <EventIcon fontSize="small" sx={{ color: '#92fe9d' }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <div>
                            {t('game')}: {lobby.game} | {t('players')}: {lobby.currentPlayers}/{lobby.maxPlayers}
                          </div>
                          {lobby.isEvent && lobby.eventStartTime && (
                            isEventSoon(lobby.eventStartTime) ? (
                              <div>
                                {t('startsIn')} <Countdown target={lobby.eventStartTime} />
                              </div>
                            ) : (
                              <div>
                                {t('eventOn')} {new Date(lobby.eventStartTime).toLocaleString('tr-TR')}
                              </div>
                            )
                          )}
                        </>
                      }
                      primaryTypographyProps={{
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                      }}
                      secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                    />
                  </ListItem>
                  {index < visibleLobbies.length - 1 && (
                    <Divider component="li" sx={{ borderColor: theme.palette.divider }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography
              sx={{ textAlign: 'center', color: theme.palette.text.secondary, mt: 3 }}
            >
              {t('noActiveLobbies')}
            </Typography>
          )}
        </>
      )}
      {/* Silme Onay Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('deleteLobby')}</DialogTitle>
        <DialogContent>
          <Typography>
            "{lobbyToDelete?.name}" {t('deleteConfirmationMessage')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            {t('cancel')}
          </Button>
          <SoundButton
            onClick={handleDeleteLobby}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? t('deleting') : t('delete')}
          </SoundButton>
        </DialogActions>
      </Dialog>
    </Box>
  </>
);


}

export default Home;
