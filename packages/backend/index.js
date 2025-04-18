  const express = require('express');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  const session = require('express-session');
  const MemoryStore = require('memorystore')(session);
  const cors = require('cors');

  const app = express();
  const PORT = 5000;

  // İstekleri loglamak için middleware
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

  // Bellek içi geçici lobi verisi
  let lobbies = [];

  // Sağlık kontrolü
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Giriş endpointi
  app.post('/api/login', (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'E-posta gerekli.' });
    }

    const user = { email };
    req.session.user = user;

    res.json({ message: 'Giriş başarılı', user });
  });

  // Tüm lobileri getir
  app.get('/api/lobbies', (req, res) => {
    res.json({ lobbies });
  });

  // Belirli bir lobiyi getir
  app.get('/api/lobbies/:id', (req, res) => {
    const lobbyId = parseInt(req.params.id);
    const lobby = lobbies.find(l => l.id === lobbyId);

    if (!lobby) {
      return res.status(404).json({ error: 'Lobi bulunamadı.' });
    }

    res.json({ lobby });
  });

  // Yeni lobi oluştur (sadece giriş yapan kullanıcılar)
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

  // Oturumu sonlandırmak için çıkış endpoint'i
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
  

  // Sunucuyu başlat
  app.listen(PORT, () => {
    console.log(`Backend API listening at http://localhost:${PORT}`);
  });
