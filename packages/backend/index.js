// Gerekli modüller
const crypto = require('crypto');
const TOKEN_SECRET = 'GameCenter2025!';
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const app = express();

const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: 'gamecenter_secret',
  resave: false,
  saveUninitialized: false
}));

// Dummy kullanıcı verileri
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
  { id: 'pixel-runner', name: 'Pixel Runner' },
  { id: 'galaxy-invaders', name: 'Galaxy Invaders' },
  { id: 'cyber-sprint', name: 'Cyber Sprint' },
  { id: 'zombie-rush', name: 'Zombie Rush' },
  { id: 'space-blaster', name: 'Space Blaster' },
  { id: 'ninja-escape', name: 'Ninja Escape' },
  { id: 'sky-surfer', name: 'Sky Surfer' },
  { id: 'alien-attack', name: 'Alien Attack' },
  { id: 'night-racer', name: 'Night Racer' },
  { id: 'dragon-flight', name: 'Dragon Flight' },
  { id: 'city-defender', name: 'City Defender' },
  { id: 'tower-dash', name: 'Tower Dash' }
];

const dummyLobbies = [];

function authMiddleware(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).json({ message: 'Giriş gerekli.' });
}

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/api/session-check', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email ve şifre gerekli.' });
  }

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

app.get('/api/games', authMiddleware, (req, res) => {
  res.json(allGames);
});

app.get('/api/games/:id', authMiddleware, (req, res) => {
  const game = allGames.find(g => g.id === req.params.id);
  if (game) res.json(game);
  else res.status(404).json({ message: 'Oyun bulunamadı' });
});

app.get('/api/lobbies', authMiddleware, (req, res) => {
  const now = new Date();
  const filtered = dummyLobbies.map(lobby => {
    const expireTime = new Date(lobby.createdAt);
    expireTime.setHours(expireTime.getHours() + 8);
    const isExpired = !lobby.participants.includes(lobby.createdBy) && now > expireTime;
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
  const { lobbyName, gameId, maxPlayers, isPrivate, isEvent, eventStartTime, eventEndTime } = req.body;
  if (!lobbyName || !gameId) return res.status(400).json({ message: 'Eksik bilgi' });

  const game = allGames.find(g => g.id === gameId);
  if (!game) return res.status(400).json({ message: 'Geçersiz oyun' });

  const newLobby = {
    id: `lobby-${Date.now()}`,
    name: lobbyName,
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
    createdAt: new Date()
  };

  dummyLobbies.unshift(newLobby);
  res.status(201).json({ success: true, lobby: newLobby });
});

app.post('/api/lobbies/:id/join', authMiddleware, (req, res) => {
  const lobby = dummyLobbies.find(l => l.id === req.params.id);
  if (!lobby) return res.status(404).json({ message: 'Lobi bulunamadı' });

  const userEmail = req.session.user.email;

  if (!lobby.participants.includes(userEmail)) {
    lobby.participants.push(userEmail);
    lobby.currentPlayers++;
  }

  res.json({ success: true, participants: lobby.participants });
});

app.post('/api/lobbies/:id/leave', authMiddleware, (req, res) => {
  const lobby = dummyLobbies.find(l => l.id === req.params.id);
  if (!lobby) return res.status(404).json({ message: 'Lobi bulunamadı' });

  const userEmail = req.session.user.email;
  lobby.participants = lobby.participants.filter(p => p !== userEmail);
  lobby.currentPlayers = Math.max(0, lobby.participants.length);

  res.json({ success: true, participants: lobby.participants });
});

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} üzerinde çalışıyor.`);
});
