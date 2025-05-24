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

// Dummy kullanıcı verisi
const DUMMY_USER = {
  email: 'test@test.com',
  passwordHash: crypto.createHash('sha256').update('06Sh1854').digest('hex'),
  id: '123',
  name: 'Test Kullanıcısı'
};

// Dummy oyun ve lobi verisi
const allGames = [
  { id: 'pixel-runner', name: 'Pixel Runner', image: '/images/pixel-runner.jpg', description: 'Reflekslerini test etmeye hazır mısın? Pixel Runner, sonsuz bir koşu oyunudur...' },
  { id: 'galaxy-invaders', name: 'Galaxy Invaders', image: '/images/galaxy-invaders.jpg', description: 'Uzaylılar galaksiyi istila etti! Gemini güçlendir, yeni silahlar aç...' },
  { id: 'cyber-sprint', name: 'Cyber Sprint', image: '/images/cyber-sprint.jpg', description: 'Cyberpunk şehrinde hız kesmeden ilerle. Dijital tuzaklardan kaç...' },
  { id: 'zombie-rush', name: 'Zombie Rush', image: '/images/zombie-rush.jpg', description: 'Zombi kıyameti başladı! Kaynak topla, barınağını güçlendir...' },
  { id: 'space-blaster', name: 'Space Blaster', image: '/images/space-blaster.jpg', description: 'Uzayın derinliklerinde düşman filosuna karşı tek başınasın...' },
  { id: 'ninja-escape', name: 'Ninja Escape', image: '/images/ninja-escape.jpg', description: 'Bir tapınaktan kaçmakla görevli bir ninjasın...' },
  { id: 'sky-surfer', name: 'Sky Surfer', image: '/images/sky-surfer.jpg', description: 'Bulutların üstünde bir sörfçü olarak havada süzül...' },
  { id: 'alien-attack', name: 'Alien Attack', image: '/images/alien-attack.jpg', description: 'Uzaylılar dünyaya saldırıyor! Şehirleri koru...' },
  { id: 'night-racer', name: 'Night Racer', image: '/images/night-racer.jpg', description: 'Gece yarışları başladı! Neon ışıklarla dolu pistlerde drift yap...' },
  { id: 'dragon-flight', name: 'Dragon Flight', image: '/images/dragon-flight.jpg', description: 'Ejderhanla gökyüzüne hükmet! Düşman kalelerini yok et...' },
  { id: 'city-defender', name: 'City Defender', image: '/images/city-defender.jpg', description: 'Şehrin son savunma hattı sensin. Dronlara karşı savunma kur...' },
  { id: 'tower-dash', name: 'Tower Dash', image: '/images/tower-dash.jpg', description: 'Yüksek bir kulede yukarı doğru zıplayarak ilerle...' }
];

const dummyLobbies = [];

// Auth middleware
function authMiddleware(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).json({ message: 'Giriş gerekli.' });
}

// API Endpointleri
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

  if (email === DUMMY_USER.email && hashedPassword === DUMMY_USER.passwordHash) {
    const token = crypto.createHash('sha256').update(email + TOKEN_SECRET).digest('hex');

    req.session.user = {
      email: DUMMY_USER.email,
      id: DUMMY_USER.id,
      name: DUMMY_USER.name
    };

    res.json({ success: true, user: req.session.user, token });
  } else {
    res.status(401).json({ success: false, message: 'Geçersiz e-posta veya şifre.' });
  }
});
  
 app.post('/api/token-verify', (req, res) => {
  const { token } = req.body;
  const expectedToken = crypto.createHash('sha256').update(DUMMY_USER.email + TOKEN_SECRET).digest('hex');

  if (token === expectedToken) {
    req.session.user = {
      email: DUMMY_USER.email,
      id: DUMMY_USER.id,
      name: DUMMY_USER.name
    };
    return res.json({ success: true, user: req.session.user });
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
  res.json(dummyLobbies);
});

app.get('/api/lobbies/:id', authMiddleware, (req, res) => {
  const lobby = dummyLobbies.find(l => l.id === req.params.id);
  if (lobby) res.json(lobby);
  else res.status(404).json({ message: 'Lobi bulunamadı' });
});

app.post('/api/lobbies', authMiddleware, (req, res) => {
  const { lobbyName, gameId, maxPlayers, isPrivate } = req.body;
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
    isEvent: false,
    createdBy: req.session.user.email,
    createdAt: new Date()
  };

  dummyLobbies.unshift(newLobby);
  res.status(201).json({ success: true, lobby: newLobby });
});

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} üzerinde çalışıyor.`);
});
