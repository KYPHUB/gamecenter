// Gerekli kütüphaneleri import et
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

// Express uygulamasını oluştur
const app = express();

// CORS Ayarları
app.use(cors({
    origin: 'http://localhost:3000', // Frontend'in adresi
    credentials: true // Cookie/Session için gerekli
}));

// Session Ayarları
app.use(session({
    cookie: { maxAge: 86400000 }, // 1 gün geçerli
    store: new MemoryStore({ checkPeriod: 86400000 }), // Hafızada tut, periyodik temizle
    secret: 'bu-cok-gizli-bir-anahtar-olmalı-gercek-projede-degistirilmeli', // Session ID'sini imzalamak için anahtar
    resave: false, // Değişmediyse tekrar kaydetme
    saveUninitialized: false // Yeni ama değiştirilmemişse kaydetme
}));

// Middleware'ler: Gelen isteklerin body'sini parse etmek için
app.use(express.json()); // JSON body'leri için
app.use(express.urlencoded({ extended: true })); // URL-encoded body'ler için

// === Sabit (Dummy) Veriler ===

const allGames = [
  { id: 'pixel-runner', name: 'Pixel Runner', image: '/images/pixel-runner.jpg', description: 'Engellerden koşarak kaç!' },
  { id: 'galaxy-invaders', name: 'Galaxy Invaders', image: '/images/galaxy-invaders.jpg', description: 'Galaksiyi istilacılardan koru!' },
  { id: 'cyber-sprint', name: 'Cyber Sprint', image: '/images/cyber-sprint.jpg', description: 'Fütüristik bir yarışta engelleri aş!' },
  { id: 'zombie-rush', name: 'Zombie Rush', image: '/images/zombie-rush.jpg', description: 'Zombi sürüsünden kaç ve hayatta kal!' },
  { id: 'space-blaster', name: 'Space Blaster', image: '/images/space-blaster.jpg', description: 'Asteroitleri ve düşman gemilerini yok et!' },
  { id: 'ninja-escape', name: 'Ninja Escape', image: '/images/ninja-escape.jpg', description: 'Gizlilikle engelleri aşarak kaç!' },
  { id: 'sky-surfer', name: 'Sky Surfer', image: '/images/sky-surfer.jpg', description: 'Gökyüzünde süzülerek engellerden kaçın!' },
  { id: 'alien-attack', name: 'Alien Attack', image: '/images/alien-attack.jpg', description: 'Dünyayı uzaylı saldırısından koru!' },
  { id: 'night-racer', name: 'Night Racer', image: '/images/night-racer.jpg', description: 'Gece şehrinde hızla yarış!' },
  { id: 'dragon-flight', name: 'Dragon Flight', image: '/images/dragon-flight.jpg', description: 'Ejderhanla uçarak hedefleri vur!' },
  { id: 'city-defender', name: 'City Defender', image: '/images/city-defender.jpg', description: 'Şehrini düşman saldırılarından koru!' },
  { id: 'tower-dash', name: 'Tower Dash', image: '/images/tower-dash.jpg', description: 'Kulede hızla yukarı tırman!' }
  // Not: image yolları ('/images/...') frontend'in public/images klasöründe olmalı.
];

const dummyLobbies = [
  { id: 'lobby1', name: "Pixel Ustaları", game: "Pixel Runner", currentPlayers: 3, maxPlayers: 5, isPrivate: false, isEvent: false },
  { id: 'lobby2', name: "Galaksi Savaşçıları", game: "Galaxy Invaders", currentPlayers: 8, maxPlayers: 10, isPrivate: true, isEvent: false },
  { id: 'lobby3', name: "Hafta Sonu Turnuvası", game: "Cyber Sprint", currentPlayers: 15, maxPlayers: 20, isPrivate: false, isEvent: true, eventEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000) },
];

// === API Endpointleri ===

// --- Durum ve Yetkilendirme Endpointleri ---

// Backend'in çalışıp çalışmadığını kontrol eder
app.get('/api/status', (req, res) => {
    console.log("Status check isteği geldi.");
    res.status(200).json({ status: 'OK', message: 'Backend çalışıyor!' });
});

// Aktif bir session olup olmadığını ve varsa kullanıcı bilgisini döndürür
app.get('/api/auth/session', (req, res) => {
    if (req.session && req.session.user) {
        console.log("Aktif session kontrol edildi, kullanıcı:", req.session.user.email);
        res.status(200).json({ user: req.session.user });
    } else {
        console.log("Aktif session kontrol edildi, session yok.");
        res.status(200).json({ user: null }); // Kullanıcı yoksa null döndür
    }
});

// Kullanıcı çıkış işlemi yapar, session'ı sonlandırır
app.post('/api/auth/logout', (req, res) => {
    console.log("Logout isteği geldi.");
    if (req.session) {
        req.session.destroy(err => { // Session'ı yok et
            if (err) {
                console.error("Session sonlandırma hatası:", err);
                return res.status(500).json({ success: false, message: 'Logout sırasında hata oluştu.' });
            }
            res.clearCookie('connect.sid'); // Session cookie'sini temizle (varsayılan adı)
            console.log("Session başarıyla sonlandırıldı.");
            res.status(200).json({ success: true, message: 'Başarıyla çıkış yapıldı.' });
        });
    } else {
        console.log("Logout isteği geldi ama aktif session yoktu.");
        res.status(200).json({ success: true, message: 'Aktif oturum bulunamadı.' });
    }
});

// Kullanıcı giriş işlemi yapar, başarılıysa session başlatır
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Login isteği geldi:', email, password ? '******' : undefined); // Şifreyi loglama

    // Örnek kullanıcı (normalde veritabanından kontrol edilir)
    const DUMMY_USER_EMAIL = 'test@test.com';
    const DUMMY_USER_PASSWORD = 'password';

    if (email === DUMMY_USER_EMAIL && password === DUMMY_USER_PASSWORD) {
        console.log('Login başarılı!');
        // Session'a kullanıcı bilgilerini kaydet
        req.session.user = {
            email: DUMMY_USER_EMAIL,
            id: '123', // Örnek ID
            name: 'Test Kullanıcısı' // Örnek isim
        };
        // Başarılı yanıt gönder (session cookie'si otomatik eklenir)
        res.status(200).json({ success: true, message: 'Giriş başarılı!', user: req.session.user });
    } else {
        console.log('Login başarısız!');
        res.status(401).json({ success: false, message: 'Geçersiz e-posta veya şifre.' });
    }
});


// --- Oyun ve Lobi Endpointleri ---

// Tüm oyunları listeler
app.get('/api/games', (req, res) => {
    console.log("Oyun listesi isteği geldi.");
    // Sadece giriş yapanların görmesi için kontrol
    if (!req.session || !req.session.user) {
       return res.status(401).json({ message: 'Oyunları görmek için giriş yapmalısınız.' });
    }
    res.status(200).json(allGames); // Tam oyun listesini döndür
});

// Tüm (aktif) lobileri listeler
app.get('/api/lobbies', (req, res) => {
    console.log("Lobi listesi isteği geldi.");
    // Sadece giriş yapanların görmesi için kontrol
     if (!req.session || !req.session.user) {
       return res.status(401).json({ message: 'Lobileri görmek için giriş yapmalısınız.' });
    }
    // TODO: Gerçek uygulamada aktif lobiler filtrelenmeli
    res.status(200).json(dummyLobbies);
});

// Belirli bir ID'ye sahip lobi detayını getirir
app.get('/api/lobbies/:id', (req, res) => {
    const lobbyId = req.params.id; // URL'den ID'yi al
    console.log(`Tek lobi detayı isteği geldi: ID=${lobbyId}`);

    // Sadece giriş yapanların görmesi için kontrol
    if (!req.session || !req.session.user) {
       return res.status(401).json({ message: 'Lobi detaylarını görmek için giriş yapmalısınız.' });
    }

    // Dummy lobiler içinde ID'ye göre ara
    const foundLobby = dummyLobbies.find(lobby => lobby.id === lobbyId);

    if (foundLobby) {
        console.log("Lobi bulundu:", foundLobby.name);
        res.status(200).json(foundLobby); // Lobi verisini döndür
    } else {
        console.log("Lobi bulunamadı.");
        res.status(404).json({ message: `Lobi bulunamadı: ${lobbyId}` }); // Bulunamadı hatası
    }
});


// === Sunucuyu Başlatma ===
const PORT = process.env.PORT || 3001; // Ortam değişkeninden veya varsayılan 3001 portu
app.listen(PORT, () => {
    console.log(`Backend sunucusu http://localhost:${PORT} adresinde çalışıyor...`);
});

app.post('/api/lobbies', (req, res) => {
    if (!req.session || !req.session.user) {
       return res.status(401).json({ message: 'Lobi oluşturmak için giriş yapmalısınız.' });
    }

    // <<<--- gameId, maxPlayers, isPrivate'ı da request body'den al ---
    const { lobbyName, gameId, maxPlayers, isPrivate } = req.body;

    // <<<--- Doğrulamaları güncelle ---
    if (!lobbyName || lobbyName.trim() === '') return res.status(400).json({ message: 'Lobi adı boş olamaz.' });
    if (!gameId) return res.status(400).json({ message: 'Oyun seçimi zorunludur.' });

    // Oyuncu sayısı kontrolü (varsayılan 6)
    let validMaxPlayers = parseInt(maxPlayers, 10);
    if (isNaN(validMaxPlayers) || validMaxPlayers < 2 || validMaxPlayers > 6) {
        console.warn(`Geçersiz maxPlayers (${maxPlayers}) alındı, varsayılan 6 kullanılacak.`);
        validMaxPlayers = 6; // Geçersizse varsayılanı kullan
    }

    const selectedGameDetails = allGames.find(g => g.id === gameId);
    if (!selectedGameDetails) return res.status(400).json({ message: 'Geçersiz oyun seçimi.' });

    // <<<--- Yeni lobi objesini güncelle ---
    const newLobby = {
        id: `lobby-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: lobbyName.trim(),
        game: selectedGameDetails.name,
        gameId: gameId,
        currentPlayers: 1,
        maxPlayers: validMaxPlayers, // <<<--- Gelen değeri (veya varsayılanı) kullan
        isPrivate: !!isPrivate,      // <<<--- Gelen boolean değeri kullan (veya false)
        isEvent: false,             // Şimdilik false
        createdBy: req.session.user.email,
        createdAt: new Date()
    };

    dummyLobbies.unshift(newLobby);
    console.log("Yeni lobi oluşturuldu:", newLobby);

    res.status(201).json({ success: true, message: 'Lobi başarıyla oluşturuldu!', lobby: newLobby });
});