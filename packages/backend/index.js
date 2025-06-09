const crypto = require('crypto');
const TOKEN_SECRET = 'GameCenter2025!';
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const path = require('path');

const http = require('http');
const { Server } = require('socket.io');
const sharedSession = require('express-socket.io-session');

const app = express();
const PORT = 5000;

/* ------------------- Session Middleware (paylaşılabilir) ------------------ */
const sessionMiddleware = session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: 'gamecenter_secret',
  resave: false,
  saveUninitialized: false,
});

/* ---------------------------- Express Setup ------------------------------- */
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../backend/images')));
app.use(sessionMiddleware);

/* ---------------------- HTTP + WebSocket Server --------------------------- */
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000', credentials: true },
});
io.use(sharedSession(sessionMiddleware, { autoSave: true }));

io.on('connection', (socket) => {
  const user = socket.handshake.session?.user;
  if (!user) return socket.disconnect(true);
  console.log('🔌 WebSocket bağlantısı:', user.email);

  socket.on("join-lobby", (lobbyId) => {
    socket.join(lobbyId);
    console.log(`➡️  ${user.email} joined lobby ${lobbyId}`);
  });

  socket.on("tombala:draw", ({ lobbyId, number }) => {
  io.to(lobbyId).emit("tombala:draw", { lobbyId, number });
});



  socket.on("tombala:start", (lobbyId) => {
    console.log(`🚀 Oyun başlatıldı → Lobby ${lobbyId}`);
    io.to(lobbyId).emit("tombala:start",lobbyId);
  });

  socket.on("disconnect", () => {
    console.log('❌ Socket ayrıldı:', user.email);
  });
});



/* ----------------------------- Dummy Veriler ------------------------------ */
const DUMMY_USER = {
  email: 'test@test.com',
  passwordHash: crypto.createHash('sha256').update('06Sh1854').digest('hex'),
  id: '123',
  name: 'Test Kullanıcısı'
};

const SECOND_USER = {
  email: 'admin@test.com',
  passwordHash: crypto.createHash('sha256').update('admin123').digest('hex'),
  id: '456',
  name: 'Admin Kullanıcı'
};

const allGames = [
  {
  id: 'tombala',
  name: 'Tombala',
  image: '/images/tombala.jpg',
  description: 'Tombala’da her oyuncu 15 sayılı kart alır; torbadan çekilen numaralar tek tek anons edilir ve oyuncular kartlarındaki eşleşen sayıları kapatır. İlk satırını tamamen dolduran “çinko” diyerek ara ödül kazanır, tüm sayıları kapatan ise “tombala” yaparak oyunu bitirir.'
},

  {
    id: 'pixel-runner',
    name: 'Pixel Runner',
    image: '/images/pixel-runner.jpg',
    description: 'Reflekslerini test etmeye hazır mısın? Pixel Runner, sonsuz bir koşu oyunudur...'
  },
  {
    id: 'galaxy-invaders',
    name: 'Galaxy Invaders',
    image: '/images/galaxy-invaders.jpg',
    description: 'Uzaylılar galaksiyi istila etti! Gemini güçlendir, yeni silahlar aç...'
  },
  {
    id: 'cyber-sprint',
    name: 'Cyber Sprint',
    image: '/images/cyber-sprint.jpg',
    description: 'Cyberpunk şehrinde hız kesmeden ilerle. Dijital tuzaklardan kaç...'
  },
  {
    id: 'zombie-rush',
    name: 'Zombie Rush',
    image: '/images/zombie-rush.jpg',
    description: 'Zombi kıyameti başladı! Kaynak topla, barınağını güçlendir...'
  },
  {
    id: 'space-blaster',
    name: 'Space Blaster',
    image: '/images/space-blaster.jpg',
    description: 'Uzayın derinliklerinde düşman filosuna karşı tek başınasın...'
  },
  {
    id: 'ninja-escape',
    name: 'Ninja Escape',
    image: '/images/ninja-escape.jpg',
    description: 'Bir tapınaktan kaçmakla görevli bir ninjasın...'
  },
  {
    id: 'sky-surfer',
    name: 'Sky Surfer',
    image: '/images/sky-surfer.jpg',
    description: 'Bulutların üstünde bir sörfçü olarak havada süzül...'
  },
  {
    id: 'alien-attack',
    name: 'Alien Attack',
    image: '/images/alien-attack.jpg',
    description: 'Uzaylılar dünyaya saldırıyor! Şehirleri koru...'
  },
  {
    id: 'night-racer',
    name: 'Night Racer',
    image: '/images/night-racer.jpg',
    description: 'Gece yarışları başladı! Neon ışıklarla dolu pistlerde drift yap...'
  },
  {
    id: 'dragon-flight',
    name: 'Dragon Flight',
    image: '/images/dragon-flight.jpg',
    description: 'Ejderhanla gökyüzüne hükmet! Düşman kalelerini yok et...'
  },
  {
    id: 'city-defender',
    name: 'City Defender',
    image: '/images/city-defender.jpg',
    description: 'Şehrin son savunma hattı sensin. Dronlara karşı savunma kur...'
  },
  
];


const dummyLobbies = [];

/* --------------------------- Middleware ----------------------------------- */
function authMiddleware(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).json({ message: 'Giriş gerekli.' });
}

/* --------------------------- API Rotaları --------------------------------- */
app.get('/api/status', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/api/session-check', (req, res) => {
  if (req.session?.user) res.json({ loggedIn: true, user: req.session.user });
  else res.json({ loggedIn: false });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email ve şifre gerekli.' });

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  let matchedUser = null;

  if (email === DUMMY_USER.email && hashedPassword === DUMMY_USER.passwordHash) {
    matchedUser = DUMMY_USER;
  } else if (email === SECOND_USER.email && hashedPassword === SECOND_USER.passwordHash) {
    matchedUser = SECOND_USER;
  }

  if (matchedUser) {
    const token = crypto.createHash('sha256').update(email + TOKEN_SECRET).digest('hex');
    req.session.user = {
      email: matchedUser.email,
      id: matchedUser.id,
      name: matchedUser.name
    };
    return res.json({ success: true, user: req.session.user, token });
  }

  res.status(401).json({ success: false, message: 'Geçersiz e-posta veya şifre.' });
});

app.post('/api/token-verify', (req, res) => {
  const { token } = req.body;
  const userList = [DUMMY_USER, SECOND_USER];

  for (const u of userList) {
    const expectedToken = crypto.createHash('sha256').update(u.email + TOKEN_SECRET).digest('hex');
    if (token === expectedToken) {
      req.session.user = {
        email: u.email,
        id: u.id,
        name: u.name
      };
      return res.json({ success: true, user: req.session.user });
    }
  }

  res.status(401).json({ success: false, message: 'Geçersiz token.' });
});

app.post('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: 'Çıkış yapılamadı.' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Çıkış başarılı' });
    });
  } else {
    res.status(400).json({ message: 'Aktif oturum yok.' });
  }
});

app.get('/api/games', authMiddleware, (_req, res) => {
  res.json(allGames);
});

app.get('/api/games/:id', authMiddleware, (req, res) => {
  const game = allGames.find(g => g.id === req.params.id);
  if (game) res.json(game);
  else res.status(404).json({ message: 'Oyun bulunamadı' });
});

/* ---------------------------- LOBBY API ----------------------------------- */
app.get('/api/lobbies', authMiddleware, (_req, res) => {
  const now = new Date();
  const filtered = dummyLobbies.map(lobby => {
    const expireTime = new Date(lobby.creatorLeftAt || 9999);
    expireTime.setHours(expireTime.getHours() + 8);
    const isExpired = lobby.creatorLeftAt && now > expireTime;
    return { ...lobby, status: isExpired ? 'closed' : 'open' };
  });
  const visible = filtered.filter(lobby => lobby.status !== 'closed');
  res.json(visible);
});

app.get('/api/lobbies/:id', authMiddleware, (req, res) => {
  const lobby = dummyLobbies.find(l => l.id === req.params.id);
  if (lobby) res.json(lobby);
  else res.status(404).json({ message: 'Lobi bulunamadı' });
});

app.post('/api/lobbies', authMiddleware, (req, res) => {
  const { lobbyName, gameId, maxPlayers, isPrivate, isEvent, eventStartTime, eventEndTime, password } = req.body;
  if (!lobbyName || !gameId) return res.status(400).json({ message: 'Eksik bilgi' });

  
const hasActiveLobby = dummyLobbies.some(
  (l) =>
    l.createdBy === req.session.user.email &&
    (!l.creatorLeftAt || new Date() < new Date(l.creatorLeftAt).setHours(new Date(l.creatorLeftAt).getHours() + 8))
);

if (hasActiveLobby) {
  return res.status(400).json({ message: 'Zaten aktif bir lobiniz var. Yeni lobi oluşturamazsınız.' });
}


  const game = allGames.find(g => g.id === gameId);
  if (!game) return res.status(400).json({ message: 'Geçersiz oyun' });

  const newLobby = {
    id: `lobby-${Date.now()}`,
    name: lobbyName.trim(),
    game: game.name,
    gameId,
    currentPlayers: 1,
    maxPlayers: Math.min(Math.max(parseInt(maxPlayers) || 6, 2), 10),
    isPrivate: !!isPrivate,
    isEvent: !!isEvent,
    eventStartTime: isEvent ? new Date(eventStartTime) : null,
    eventEndTime: isEvent ? new Date(eventEndTime) : null,
    createdBy: req.session.user.email,
    participants: [req.session.user.email],
    createdAt: new Date(),
    creatorLeftAt: null,
    password: isPrivate ? (password || '').trim() : null
  };

  dummyLobbies.unshift(newLobby);
  io.emit('lobby:create', newLobby);
  res.status(201).json({ success: true, lobby: newLobby });
});

app.put('/api/lobbies/:id', authMiddleware, (req, res) => {
  const lobbyId = req.params.id;
  const userEmail = req.session.user.email;
  const lobby = dummyLobbies.find(l => l.id === lobbyId);
  if (!lobby) return res.status(404).json({ message: 'Lobi bulunamadı' });
  if (lobby.createdBy !== userEmail) return res.status(403).json({ message: 'Yalnızca kurucu düzenleyebilir.' });

  const { lobbyName, maxPlayers, isPrivate, isEvent, eventStartTime, eventEndTime, password, gameId } = req.body;
  const game = allGames.find(g => g.id === gameId);
  if (!game) return res.status(400).json({ message: 'Geçersiz oyun ID' });

  const newMax = Math.min(Math.max(parseInt(maxPlayers), 2), 10);
  if (newMax < lobby.currentPlayers)
    return res.status(400).json({ message: `Bu lobide zaten ${lobby.currentPlayers} oyuncu var.` });

  if (isEvent) {
    const start = new Date(eventStartTime);
    const end = new Date(eventEndTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start)
      return res.status(400).json({ message: 'Etkinlik tarihleri geçersiz' });

    lobby.eventStartTime = start;
    lobby.eventEndTime = end;
  } else {
    lobby.eventStartTime = null;
    lobby.eventEndTime = null;
  }

  lobby.name = lobbyName.trim();
  lobby.maxPlayers = newMax;
  lobby.isPrivate = !!isPrivate;
  lobby.password = isPrivate ? password?.trim() : null;
  lobby.isEvent = !!isEvent;
  lobby.gameId = game.id;
  lobby.game = game.name;

  io.emit('lobby:update', lobby);
  res.json({ success: true, message: 'Lobi güncellendi', lobby });
});

app.delete('/api/lobbies/:id', authMiddleware, (req, res) => {
  const lobbyId = req.params.id;
  const userEmail = req.session.user.email;
  const index = dummyLobbies.findIndex(l => l.id === lobbyId);
  if (index === -1) return res.status(404).json({ message: 'Lobi bulunamadı' });

  const lobby = dummyLobbies[index];
  if (lobby.createdBy !== userEmail)
    return res.status(403).json({ message: 'Yalnızca kurucu silebilir.' });

  dummyLobbies.splice(index, 1);
  io.emit('lobby:delete', lobby.id);
  res.json({ success: true, message: 'Lobi silindi' });
});

app.post('/api/lobbies/:id/join', authMiddleware, (req, res) => {
  const lobby = dummyLobbies.find(l => l.id === req.params.id);
  if (!lobby) return res.status(404).json({ message: 'Lobi bulunamadı' });

  const userEmail = req.session.user.email;
  if (lobby.isPrivate) {
    const providedPassword = (req.body.password || "").trim();
    if (!providedPassword || providedPassword !== lobby.password) {
      return res.status(401).json({ message: 'Şifre hatalı.' });
    }
  }

  if (!lobby.participants.includes(userEmail)) {
    lobby.participants.push(userEmail);
    lobby.currentPlayers++;
    io.to(lobby.id).emit('player:join', { lobbyId: lobby.id, email: userEmail });

  }

  res.json({ success: true, participants: lobby.participants });
});

app.post('/api/lobbies/:id/leave', authMiddleware, (req, res) => {
  const lobby = dummyLobbies.find(l => l.id === req.params.id);
  if (!lobby) return res.status(404).json({ message: 'Lobi bulunamadı' });

  const userEmail = req.session.user.email;
  lobby.participants = lobby.participants.filter(p => p !== userEmail);
  if (userEmail === lobby.createdBy && !lobby.creatorLeftAt) {
    lobby.creatorLeftAt = new Date();
  }

  lobby.currentPlayers = Math.max(0, lobby.participants.length);
  io.emit('player:leave', { lobbyId: lobby.id, email: userEmail });

  res.json({ success: true, participants: lobby.participants });
});

/* --------------------------- Sunucuyu Başlat ------------------------------ */
httpServer.listen(PORT, () => {
  console.log(`🟢  Backend + WebSocket http://localhost:${PORT}`);
});
