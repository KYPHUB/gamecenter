import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import EventIcon from "@mui/icons-material/Event";
import Countdown from "../components/Countdown";


export default function Lobby() {
  const navigate = useNavigate();
  const { user, verifyToken, isLoading: authLoading } = useAuth();

  const [tokenOk, setTokenOk] = useState(false);
  const [games, setGames] = useState([]);
  const [lobbies, setLobbies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lobbyName, setLobbyName] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [lobbyPassword, setLobbyPassword] = useState("");


  const fetchAll = async () => {
    setLoading(true);
    try {
      const [gRes, lRes] = await Promise.all([
        axios.get("/api/games", { withCredentials: true }),
        axios.get("/api/lobbies", { withCredentials: true }),
      ]);
      setGames(gRes.data);
      setLobbies(lRes.data);
    } catch (e) {
      setError("Veriler alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!(await verifyToken())) return navigate("/login", { replace: true });
      setTokenOk(true);
      fetchAll();
    })();
  }, []);

  // === GÜNCELLENMİŞ createLobby ===
  const createLobby = async () => {
    setFormError(null);

    if (!lobbyName.trim() || !selectedGame) {
      return setFormError('Lobi adı ve oyun seçimi zorunludur.');
    }
    if (maxPlayers < 2 || maxPlayers > 10) {
      return setFormError('Oyuncu sayısı 2-10 arasında olmalı.');
    }

    if (isEvent) {
      if (!startTime || !endTime) {
        return setFormError('Etkinlik lobisi için başlangıç ve bitiş zamanı seçin.');
      }

      const dtRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!dtRegex.test(startTime) || !dtRegex.test(endTime)) {
        return setFormError('Tarih formatı geçersiz (yyyy-MM-dd HH:mm).');
      }

      const yearStartStr = startTime.split('-')[0];
      const yearEndStr   = endTime.split('-')[0];
      if (yearStartStr.length !== 4 || yearEndStr.length !== 4) {
        return setFormError('Yıl tam 4 haneli olmalıdır.');
      }

      const start = new Date(startTime);
      const end   = new Date(endTime);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return setFormError('Tarih geçersiz.');
      }

      const now = new Date();
      if (start < now)      return setFormError('Başlangıç tarihi geçmişte olamaz.');
      if (end   < now)      return setFormError('Bitiş tarihi geçmişte olamaz.');
      if (end   < start)    return setFormError('Bitiş, başlangıçtan önce olamaz.');
      if (+end === +start)  return setFormError('Bitiş ve başlangıç aynı olamaz.');
    }

    setSubmitting(true);
    try {
      const body = {
        lobbyName: lobbyName.trim(),
        gameId: selectedGame,
        maxPlayers,
        isPrivate,
        isEvent,
        eventStartTime: isEvent ? startTime : null,
        eventEndTime:   isEvent ? endTime   : null,
        password: isPrivate ? lobbyPassword : null,
      };

      const { data } = await axios.post('/api/lobbies', body, { withCredentials: true });
      setLobbies(prev => [data.lobby, ...prev]);

      // formu sıfırla
      setLobbyName('');
      setSelectedGame('');
      setMaxPlayers(6);
      setIsPrivate(false);
      setIsEvent(false);
      setStartTime('');
      setEndTime('');
    } catch {
      setFormError('Lobi oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  };



/* ------------------- render helpers ----------------------- */
const isEventSoon = (startISO) => {
  const diff = new Date(startISO) - new Date();
  return diff <= 24 * 60 * 60 * 1000 && diff > 0;
};

const isEventOver = (endISO) => new Date(endISO) < new Date();

const lobbyCard = (lobby) => (
  <ListItem
    key={lobby.id}
    sx={{
      py: 2,
      px: 3,
      backdropFilter: "blur(6px)",
      background: "rgba(255,255,255,0.04)",
      borderRadius: 2,
    }}
    secondaryAction={
      <Button variant="contained" size="small" onClick={() => navigate(`/lobby/${lobby.id}`)}>
        Katıl
      </Button>
    }
  >
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {lobby.name}
          {lobby.isPrivate && <LockIcon fontSize="small" sx={{ color: '#cfd8dc' }} />}
          {Boolean(lobby.isEvent) && <EventIcon fontSize="small" sx={{ color: '#ffeb3b' }} />}
        </Box>
      }
      secondary={
        <>
          <span>
           Oyun: {lobby.game}
          </span>

          {lobby.isEvent && (
             <span style={{ display:'block' }}>
            {isEventOver(lobby.eventEndTime) && '⏹ Sona erdi'}
            {!isEventOver(lobby.eventEndTime) && (
              isEventSoon(lobby.eventStartTime)
                ? <>Başlamasına: <Countdown target={lobby.eventStartTime} /></>
                : <>Başlangıç: {new Date(lobby.eventStartTime).toLocaleString('tr-TR')}</>
            )}
          </span>
          )}
        </>
      }
      primaryTypographyProps={{ fontWeight: 600, color: 'white' }}
      secondaryTypographyProps={{ color: '#b0bec5', mt: 0.4 }}
    />
  </ListItem>
);

/* ---------------------- ui ------------------------------- */
if (authLoading || !tokenOk || loading)
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#0f2027" }}>
      <CircularProgress />
    </Box>
  );

return (
  <>
    <Navbar />
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(145deg,#001c30 0%,#004e92 100%)", p: { xs: 2, md: 4 } }}>
      {/* ---------- create lobby card ---------- */}
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          maxWidth: "1100px",
          mx: "auto",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Typography variant="h5" sx={{ fontFamily: "Orbitron, sans-serif", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <SportsEsportsIcon /> Yeni Lobi Oluştur
        </Typography>

        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <TextField
              label="Lobi Adı"
              fullWidth
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
              InputProps={{ sx: { borderRadius: 3, color: "white" } }}
              InputLabelProps={{ sx: { color: "#b0bec5" } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: "#b0bec5" }}>Oyun Seç</InputLabel>
              <Select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                label="Oyun Seç"
                sx={{ borderRadius: 3, color: "white" }}
              >
                <MenuItem value="" disabled>
                  <em>Bir oyun seçin</em>
                </MenuItem>
                {games.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Oyuncu Sayısı (2-10)"
              type="number"
              fullWidth
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Math.min(10, Math.max(2, parseInt(e.target.value) || 2)))}
              InputProps={{ sx: { borderRadius: 3, color: "white" } }}
              InputLabelProps={{ sx: { color: "#b0bec5" } }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <FormControlLabel
              control={<Switch checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} color="secondary" />}
              label={<Typography variant="body2">🔒 Özel Lobi</Typography>}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <FormControlLabel
              control={<Switch checked={isEvent} onChange={(e) => setIsEvent(e.target.checked)} color="warning" />}
              label={<Typography variant="body2">📅 Etkinlik Lobisi</Typography>}
            />
          </Grid>

          {isEvent && (
            <Grid item xs={12} lg={4} container spacing={2}>
              <Grid item xs={12} md={6} lg={12}>
                <TextField
                  label="Başlangıç"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true, sx: { color: "#b0bec5" } }}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  InputProps={{ sx: { borderRadius: 3, color: "white" } }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={12}>
                <TextField
                  label="Bitiş"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true, sx: { color: "#b0bec5" } }}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  InputProps={{ sx: { borderRadius: 3, color: "white" } }}
                />
              </Grid>
            </Grid>
          )}
          {isPrivate && (
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              label="Lobi Şifresi"
              type="password"
              fullWidth
              value={lobbyPassword}
              onChange={(e) => setLobbyPassword(e.target.value)}
              InputProps={{ sx: { borderRadius: 3, color: "white" } }}
              InputLabelProps={{ sx: { color: "#b0bec5" } }}
            />
          </Grid>
        )}

          <Grid item xs={12} md={8} lg={4} sx={{ mt: { xs: 1, md: 0 } }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                onClick={createLobby}
                disabled={submitting}
                sx={{ borderRadius: 3, px: 4, flexShrink: 0, background: "linear-gradient(90deg,#008cff,#7d2cff)" }}
              >
                {submitting ? <CircularProgress size={24} /> : "➕ Lobi Oluştur"}
              </Button>
              <Tooltip title="Yenile">
                <IconButton color="inherit" onClick={fetchAll}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ---------- lobby list ---------- */}
      <Box mt={6} maxWidth="1100px" mx="auto">
        <Typography variant="h5" color="#ffa700" sx={{ mb: 2, fontFamily: "Orbitron, sans-serif" }}>
          Aktif Lobiler ({lobbies.length})
        </Typography>

        {lobbies.length === 0 && <Alert severity="info">Henüz lobi yok</Alert>}

        <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {lobbies.map((l) => lobbyCard(l))}
        </List>
      </Box>
    </Box>
  </>
);
}

