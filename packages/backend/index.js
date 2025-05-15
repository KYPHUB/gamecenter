const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware: istek loglama
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// CORS ayarı
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'gamecenter_secret',
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({ checkPeriod: 86400000 })
}));

// Giriş kontrolü için middleware
function authMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Giriş yapmanız gerekiyor.' });
  }
}

// Bellek içi lobi ve oyun verileri
let lobbies = [];

const games = [
  {
    id: 'pixel-runner',
    name: 'Pixel Runner',
    description: 'Reflekslerini test etmeye hazır mısın? Pixel Runner, sonsuz bir koşu oyunudur...',
    image: '/images/pixel-runner.jpg'
  },
  {
    id: 'galaxy-invaders',
    name: 'Galaxy Invaders',
    description: 'Uzaylılar galaksiyi istila etti! Gemini güçlendir, yeni silahlar aç...',
    image: '/images/galaxy-invaders.jpg'
  },
  {
    id: 'cyber-sprint',
    name: 'Cyber Sprint',
    description: 'Cyberpunk şehrinde hız kesmeden ilerle. Dijital tuzaklardan kaç...',
    image: '/images/cyber-sprint.jpg'
  },
  {
    id: 'zombie-rush',
    name: 'Zombie Rush',
    description: 'Zombi kıyameti başladı! Kaynak topla, barınağını güçlendir...',
    image: '/images/zombie-rush.jpg'
  },
  {
    id: 'space-blaster',
    name: 'Space Blaster',
    description: 'Uzayın derinliklerinde düşman filosuna karşı tek başınasın...',
    image: '/images/space-blaster.jpg'
  },
  {
    id: 'ninja-escape',
    name: 'Ninja Escape',
    description: 'Bir tapınaktan kaçmakla görevli bir ninjasın...',
    image: '/images/ninja-escape.jpg'
  },
  {
    id: 'sky-surfer',
    name: 'Sky Surfer',
    description: 'Bulutların üstünde bir sörfçü olarak havada süzül...',
    image: '/images/sky-surfer.jpg'
  },
  {
    id: 'alien-attack',
    name: 'Alien Attack',
    description: 'Uzaylılar dünyaya saldırıyor! Şehirleri koru...',
    image: '/images/alien-attack.jpg'
  },
  {
    id: 'night-racer',
    name: 'Night Racer',
    description: 'Gece yarışları başladı! Neon ışıklarla dolu pistlerde drift yap...',
    image: '/images/night-racer.jpg'
  },
  {
    id: 'dragon-flight',
    name: 'Dragon Flight',
    description: 'Ejderhanla gökyüzüne hükmet! Düşman kalelerini yok et...',
    image: '/images/dragon-flight.jpg'
  },
  {
    id: 'city-defender',
    name: 'City Defender',
    description: 'Şehrin son savunma hattı sensin. Dronlara karşı savunma kur...',
    image: '/images/city-defender.jpg'
  },
  {
    id: 'tower-dash',
    name: 'Tower Dash',
    description: 'Yüksek bir kulede yukarı doğru zıplayarak ilerle...',
    image: '/images/tower-dash.jpg'
  }
];

// ----------- ROUTES ----------- //

// Sağlık kontrolü
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Session kontrolü
app.get('/api/session-check', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Backend canlı mı?
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend çalışıyor' });
});

// Giriş
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'E-posta gerekli.' });
  }

  const user = { email };
  req.session.user = user;

  res.json({ message: 'Giriş başarılı', user });
});

// Çıkış
app.post('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: 'Çıkış yapılamadı.' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Çıkış başarılı' });
    });
  } else {
    res.status(400).json({ error: 'Aktif oturum yok.' });
  }
});

// Tüm lobileri getir
app.get('/api/lobbies', (req, res) => {
  res.json({ lobbies });
});

// Belirli lobi getir
app.get('/api/lobbies/:id', (req, res) => {
  const lobbyId = parseInt(req.params.id);
  const lobby = lobbies.find(l => l.id === lobbyId);
  if (!lobby) {
    return res.status(404).json({ error: 'Lobi bulunamadı.' });
  }
  res.json({ lobby });
});

// Yeni lobi oluştur
app.post('/api/lobbies', authMiddleware, (req, res) => {
  const { name, duration, players, createdBy } = req.body;
  if (!name || !duration || !players || !createdBy) {
    return res.status(400).json({ error: 'Eksik bilgi gönderildi.' });
  }

  const newLobby = {
    id: Date.now(),
    name,
    duration,
    players,
    createdBy,
    joinedUsers: [createdBy]
  };

  lobbies.push(newLobby);
  res.status(201).json({ message: 'Lobi oluşturuldu', lobby: newLobby });
});

// Tüm oyunları getir
app.get('/api/games', (req, res) => {
  res.json(games);
});

// Tekil oyun bilgisi
app.get('/api/games/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ error: 'Oyun bulunamadı' });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Backend API listening at http://localhost:${PORT}`);
});
