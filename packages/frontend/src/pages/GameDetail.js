import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, CircularProgress, Alert, Switch, ToggleButton, ToggleButtonGroup,
  Container, Stack, Paper,
} from '@mui/material';

import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PaletteIcon from '@mui/icons-material/Palette';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HistoryIcon from '@mui/icons-material/History';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { MenuPage, GamePage } from '@gamecenter/tombala';


const NEON_CYAN = '#00eaff';
const NEON_GREEN = '#7CFC00';
const NEON_YELLOW = '#ffcc70';
const NEON_ORANGE = '#ffa500';
const NEON_RED = '#ff3c3c';
const NEON_PINK_ACCENT = '#FF69B4';

const PANEL_TRANSITION = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
const PANEL_BORDER_RADIUS = 4;
const PANEL_BACKGROUND_COLOR = 'rgba(15, 32, 47, 0.7)';
const PANEL_BACKDROP_FILTER = 'blur(10px) saturate(120%)';
const PANEL_BOX_SHADOW_DEFAULT = '0 4px 15px rgba(0,0,0,0.3)';
const PANEL_BOX_SHADOW_HOVER = '0 8px 30px rgba(0,0,0,0.4)';


function GameDetail() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { verifyToken } = useAuth();

  const [tokenVerified, setTokenVerified] = useState(false);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [soundOn, setSoundOn] = useState(true);
  const [theme, setTheme] = useState('neon');
  const [difficulty, setDifficulty] = useState('easy');
  const muiTheme = useTheme();
  const { t } = useTranslation();
  const [relatedLobbies, setRelatedLobbies] = useState([]);
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    // Bu oyuna ait aktif lobileri çek
    const fetchRelatedLobbies = async () => {
      try {
        const res = await axios.get('/api/lobbies', { withCredentials: true });
        const filtered = res.data.filter(l => l.gameId?.toLowerCase() === gameId?.toLowerCase());
        setRelatedLobbies(filtered);
      } catch (err) {
        console.error('Lobiler alınamadı:', err);
      }
    };

    if (tokenVerified && gameId) fetchRelatedLobbies();
  }, [tokenVerified, gameId]);


  // Paneller için temel stil objesi üreten fonksiyon
  const getPanelBaseSx = (borderColor) => ({
    p: { xs: 2.5, md: 3.5 },
    borderRadius: 4,
    background: muiTheme.palette.mode === 'dark'
      ? 'rgba(15, 32, 47, 0.7)'
      : '#f7fafd',
    border: muiTheme.palette.mode === 'dark'
      ? `1px solid ${borderColor}60`
      : `1px solid rgba(0,0,0,0.08)`,
    boxShadow: muiTheme.palette.mode === 'dark'
      ? `0 4px 15px rgba(0,0,0,0.3), 0 0 5px ${borderColor}20 inset`
      : '0 4px 12px rgba(0,0,0,0.05)',
    backdropFilter: muiTheme.palette.mode === 'dark' ? 'blur(10px) saturate(120%)' : 'none',
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: muiTheme.palette.mode === 'dark'
        ? `0 8px 30px rgba(0,0,0,0.4), 0 0 10px ${borderColor}40 inset`
        : '0 8px 24px rgba(0,0,0,0.08)',
      borderColor: muiTheme.palette.mode === 'dark'
        ? `${borderColor}90`
        : 'rgba(0,0,0,0.12)',
    },
  });

  // Toggle butonları için dinamik stil objesi üreten fonksiyon
  const getToggleButtonSx = (value, selectedValue, color, hoverColor) => ({
    color: selectedValue === value ? color : '#b0bec5',
    borderColor: selectedValue === value ? `${color}cc` : 'rgba(176, 190, 197, 0.3)',
    transition: PANEL_TRANSITION,
    flexGrow: 1,
    py: 0.8,
    fontSize: '0.8rem',
    '&.Mui-selected': {
      backgroundColor: `${color}30`,
      color: color,
      boxShadow: `0 0 12px ${color}, 0 0 18px ${color}b3`,
      borderColor: `${color}ff`,
      zIndex: 1,
    },
    '&:hover': {
      backgroundColor: `${(hoverColor || color)}20`,
      borderColor: (hoverColor || color),
      zIndex: 2,
    },
  });

  // Sayfa yüklenirken token'ı doğrula
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

  // Token doğrulandıktan sonra oyun detaylarını çek
  useEffect(() => {
    if (!tokenVerified) return;

    const fetchGame = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/games/${gameId}`, { withCredentials: true });
        setGame(response.data);
        setError(null);
      } catch (err) {
        console.error("Oyun verisi alınamadı:", err.response?.data?.message || err.message);
        setError(err.response?.data?.message ||'Oyun yüklenirken bir sorun oluştu veya oyun bulunamadı.');
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId, tokenVerified]);


  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', bgcolor: '#0a121a' }}>
          <CircularProgress color="info" size={50} />
          <Typography sx={{ ml: 2.5, color: '#e0e0e0', fontSize: '1.1rem' }}>Oyun yükleniyor, lütfen bekleyin...</Typography>
        </Box>
      </>
    );
  }

  if (error || !game) {
    return (
      <>
        <Navbar />
        <Box sx={{ padding: 4, backgroundColor: '#0a121a', color: 'white', minHeight: 'calc(100vh - 64px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign: 'center' }}>
          <Alert severity="error" sx={{mb: 2.5, fontSize: '1rem', width: 'auto', maxWidth: '500px' }}>{error || 'Maalesef, aradığınız oyun bulunamadı veya yüklenirken bir sorun oluştu.'}</Alert>
          <Button onClick={() => navigate('/home')} variant="outlined" color="inherit" size="large">
            Ana Sayfaya Dön
          </Button>
        </Box>
      </>
    );
  }

  if (!tokenVerified) return null; // Token doğrulanana kadar boş render et
    
return (
  <>
    <Navbar />
    <Box
      sx={{
        position: 'relative',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        color: muiTheme.palette.text.primary,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: muiTheme.palette.mode === 'dark'
          ? 'linear-gradient(-45deg, #0b1d3a, #112e51, #0a1a2f, #1f3c64)'
          : 'linear-gradient(-45deg, #cfe9fc, #e3f2fd, #bbdefb, #d6eeff)',
        backgroundSize: '300% 300%',
        animation: 'gradientMove 18s ease infinite',
        '@keyframes gradientMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'center',
          gap: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ flex: 1, minWidth: 300, maxWidth: 420 }}
        >
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: { xs: 2, sm: 3 },
              backgroundColor: muiTheme.palette.background.paper,
              borderRadius: 3,
              boxShadow: muiTheme.customShadows.card,
              border: `1px solid ${muiTheme.palette.divider}`,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 32px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: muiTheme.palette.primary.main,
                textAlign: 'center',
                textShadow: muiTheme.palette.mode === 'dark'
                  ? '0 0 12px #00eaff'
                  : '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {game.name}
            </Typography>

            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                width: '100%',
                aspectRatio: '16 / 9',
                boxShadow: muiTheme.palette.mode === 'dark'
                  ? '0 10px 30px rgba(0,0,0,0.5), 0 0 10px rgba(0, 234, 255, 0.3)'
                  : '0 6px 16px rgba(0,0,0,0.1)',
              }}
            >
              <motion.img
                src={game.image || '/placeholder-game-image.png'}
                alt={game.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </Box>

            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginTop: 'auto',
                paddingTop: 24,
                paddingBottom: 16,
              }}
            >
              <Button
                  onClick={() => navigate('/lobby', { state: { selectedGame: game.id } })}
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  fontWeight: 'bold',
                  borderRadius: 10,
                  background: muiTheme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #00c9ff, #92fe9d)'
                    : 'linear-gradient(90deg, #2196f3, #90caf9)',
                  color: '#1c1c1c',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    filter: 'brightness(1.1)',
                  },
                }}
              >
                {t('play')}
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          style={{ flex: 1.3, minWidth: 300, maxWidth: 520 }}
        >
          <Stack spacing={3}>
            <Box sx={getPanelBaseSx(NEON_CYAN)}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                <HelpOutlineIcon sx={{ color: NEON_CYAN, fontSize: '1.8rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 'semibold', color: NEON_CYAN }}>
                  {t('howToPlay')}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  color: muiTheme.palette.text.secondary,
                  lineHeight: 1.65,
                }}
              >
                {t(`gameDescriptions.${game.id}`)}
              </Typography>
            </Box>
            
            <Box sx={getPanelBaseSx(NEON_GREEN)}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                <SettingsIcon sx={{ color: NEON_GREEN, fontSize: '1.8rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 'semibold', color: NEON_GREEN }}>
                  {t('gameSettings')}
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <VolumeUpIcon sx={{ color: muiTheme.palette.text.secondary }} />
                    <Typography sx={{ color: muiTheme.palette.text.secondary, fontSize: '1.05rem' }}>
                      {t('soundEffects')}
                    </Typography>
                  </Stack>
                  <Switch
                    checked={soundOn}
                    onChange={() => setSoundOn(!soundOn)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: NEON_GREEN,
                        '&:hover': { backgroundColor: `${NEON_GREEN}25` },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: NEON_GREEN,
                        boxShadow: `0 0 5px ${NEON_GREEN}b3`,
                      },
                      '& .MuiSwitch-thumb': { boxShadow: '0 0 2px black' },
                    }}
                  />
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PaletteIcon sx={{ color: muiTheme.palette.text.secondary }} />
                    <Typography sx={{ color: muiTheme.palette.text.secondary, fontSize: '1.05rem', mr: 1 }}>
                      {t('uiTheme')}
                    </Typography>
                  </Stack>
                  <ToggleButtonGroup
                    value={theme}
                    exclusive
                    size="medium"
                    onChange={(e, val) => val && setTheme(val)}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    <ToggleButton value="neon" sx={getToggleButtonSx('neon', theme, NEON_CYAN, NEON_PINK_ACCENT)}>
                      Neon
                    </ToggleButton>
                    <ToggleButton value="classic" sx={getToggleButtonSx('classic', theme, NEON_YELLOW, NEON_ORANGE)}>
                      {t('classic')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalFireDepartmentIcon sx={{ color: muiTheme.palette.text.secondary }} />
                    <Typography sx={{ color: muiTheme.palette.text.secondary, fontSize: '1.05rem', mr: 1 }}>
                      {t('difficultyLevel')}
                    </Typography>
                  </Stack>
                  <ToggleButtonGroup
                    value={difficulty}
                    exclusive
                    size="medium"
                    onChange={(e, val) => val && setDifficulty(val)}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    <ToggleButton value="easy" sx={getToggleButtonSx('easy', difficulty, NEON_GREEN)}>
                      {t('easy')}
                    </ToggleButton>
                    <ToggleButton value="medium" sx={getToggleButtonSx('medium', difficulty, NEON_ORANGE)}>
                      {t('medium')}
                    </ToggleButton>
                    <ToggleButton value="hard" sx={getToggleButtonSx('hard', difficulty, NEON_RED)}>
                      {t('hard')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Stack>
            </Box>
            
         

            {relatedLobbies.length > 0 && (
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: 3,
                  border: `1px solid ${NEON_ORANGE}66`,
                  background: muiTheme.palette.mode === 'dark'
                    ? 'rgba(255, 165, 0, 0.05)'
                    : '#fffaf0',
                  boxShadow: muiTheme.palette.mode === 'dark'
                    ? `0 0 12px ${NEON_ORANGE}44`
                    : '0 0 6px rgba(0,0,0,0.05)'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                  <SportsEsportsIcon sx={{ color: NEON_ORANGE }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: NEON_ORANGE }}>
                    Bu oyun için aktif lobiler
                  </Typography>
                </Stack>

                {relatedLobbies.map((lobby) => (
                  <Paper
                    key={lobby.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: muiTheme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : '#f9f9f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography fontWeight="bold" color="text.primary">
                        {lobby.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Oyuncular: {lobby.currentPlayers}/{lobby.maxPlayers}
                      </Typography>
                    </Box>
                    <Button
                      onClick={() => navigate(`/lobby/${lobby.id}`)}
                      size="small"
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        px: 3,
                        background: 'linear-gradient(90deg, #ffa500, #ffcc70)',
                        color: '#1c1c1c',
                        '&:hover': { filter: 'brightness(1.1)' }
                      }}
                    >
                      Katıl
                    </Button>
                  </Paper>
                ))}
              </Box>
            )}
            
            <Box sx={getPanelBaseSx(NEON_YELLOW)}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                <HistoryIcon sx={{ color: NEON_YELLOW, fontSize: '1.8rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 'semibold', color: NEON_YELLOW }}>
                  {t('gameHistory')}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  color: muiTheme.palette.text.secondary,
                  lineHeight: 1.65,
                }}
              >
                {t('noHistory')}
              </Typography>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  </>
);
}

export default GameDetail;