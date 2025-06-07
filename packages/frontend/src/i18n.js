// frontend/src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  tr: {
    translation: {
      // Genel
      login: "Giriş",
      logout: "Çıkış Yap",
      email: "E-posta",
      password: "Şifre",
      rememberMe: "Beni Hatırla",
      forgotPassword: "Şifremi Unuttum",
      submit: "Gönder",
      cancel: "İptal",
      loading: "Yükleniyor...",
      errorOccurred: "Bir hata oluştu.",
      // Navbar
      home: "Ana Sayfa",
      games: "Oyunlar",
      game: "Oyun", // <-- EKLENDİ
      lobbies: "Lobiler",
      profile: "Profil",
      language: "Dil",
      theme: "Tema",
      light: "Aydınlık",
      dark: "Karanlık",
      // Home.js
      homeScreen: "Ana Ekran",
      createNewLobby: "Yeni Lobi Oluştur", // Bu createLobbyTitle ile benzer, kullanım yerine göre biri tercih edilebilir. Şimdilik ikisi de duruyor.
      noGamesFound: "Hiç oyun bulunamadı.",
      activeLobbies: "Aktif Lobiler",
      noActiveLobbies: "Şu anda aktif lobi bulunmuyor.",
      loadingGamesAndLobbies: "Oyunlar ve Lobiler yükleniyor...",
      loadingError: "Veriler yüklenirken bir sorun oluştu.",
      join: "Katıl",
      leave: "Ayrıl",
      details: "Detaylar",
      go: "Git",
      pasteLobbyLink: "Lobi Linki Yapıştır",
      // Lobby.js
      lobbyName: "Lobi Adı",
      selectGame: "Oyun Seç",
      playerCount: "Oyuncu Sayısı (2-10)",
      privateLobby: "Özel Lobi",
      eventLobby: "Etkinlik Lobisi",
      startTime: "Başlangıç",
      endTime: "Bitiş",
      lobbyPassword: "Lobi Şifresi",
      createLobby: "Lobi Oluştur", // Genel "Lobi Oluştur" metni
      refresh: "Yenile",
      noLobbies: "Henüz lobi yok",
      activeLobbiesCount: "Aktif Lobiler ({{count}})",
      // LobbyDetail.js
      lobbyLink: "Lobi Bağlantısı",
      players: "Oyuncular",
      status: "Durum",
      private: "Özel Lobi",
      public: "Herkese Açık",
      eventLobbyLabel: "Etkinlik Lobisi",
      eventEndsIn: "Etkinliğin Bitmesine Kalan Süre",
      owner: "Kurucu",
      participants: "Katılımcılar",
      joinLobby: "Lobiye Katıl",
      leaveLobby: "Lobiden Ayrıl",
      deleteLobby: "Lobiyi Sil",
      editLobby: "Düzenle",
      confirmDeleteLobby: "Lobiyi Sil",
      deleteConfirmationMessage: "\"{{lobbyName}}\" adlı lobiyi silmek istediğinize emin misiniz?",
      // cancel: "İptal", // Yukarıda genel bölümde zaten var
      save: "Kaydet",
      updateSuccess: "Lobi güncellendi",
      deleteSuccess: "Lobi silindi",
      passwordRequired: "Bu lobiye katılmak için şifre gerekli",
      enterPassword: "Lobi Şifresi",
      passwordError: "Şifre yanlış",
      // GameDetail.js
      
      howToPlay: "Nasıl Oynanır?",
      gameSettings: "Oyun Ayarları",
      soundEffects: "Ses Efektleri",
      uiTheme: "Arayüz Teması",
      difficultyLevel: "Zorluk Seviyesi",
      easy: "Kolay",
      medium: "Orta",
      hard: "Zor",
      gameHistory: "Oyun Geçmişi",
      noHistory: "Bu oyun için henüz bir geçmiş kaydınız bulunmamaktadır. Oynamaya başlayarak ilk kaydınızı oluşturun!",
      startGame: "Oyunu Başlat (Yakında)",
      play: "Oyna",
      loadingGame: "Oyun yükleniyor, lütfen bekleyin...",
      errorLoadingGame: "Oyun yüklenirken bir sorun oluştu veya oyun bulunamadı.",
      // Chat.js (varsa)
      chat: "Sohbet",
      send: "Gönder",
      messagePlaceholder: "Mesajınızı yazın...",
      channelGeneral: "Genel",
      channelGame: "Oyun",
      channelLobby: "Lobi",
      channelPrivate: "Özel",
      // Bildirimler
      notificationNewMessage: "Yeni mesaj geldi",
      notificationLobbyCreated: "Yeni lobi oluşturuldu",
      // Diğer (Yinelenenler temizlendi, benzersiz olanlar korundu)
      confirm: "Onayla",
      yes: "Evet",
      no: "Hayır",
      startsIn: "Başlamasına:",
      eventOn: "Etkinlik:",
      lobbyDeleted: "Lobi Silindi",
      delete: "Sil",
      deleting: "Siliniyor...",
      linkCopied: "Bağlantı kopyalandı!",
      noOtherParticipants: "Başka katılımcı yok.",
      createLobbyTitle: "Yeni Lobi Oluştur", // createNewLobby ile benzer, bu daha çok bir başlık gibi.
      createLobbyBtn: "➕ Lobi Oluştur", // Butonlar için özel, son tanımlanan emoji'li versiyon.
      refreshTooltip: "Yenile", // refresh'ten farklı olarak tooltip için.
      howToPlay: "Nasıl Oynanır?",
noInstructions: "Bu oyun için özel bir oynanış bilgisi bulunmamaktadır. Genel oyun mekaniklerini keşfedin!",
gameSettings: "Oyun Ayarları",
soundEffects: "Ses Efektleri",
uiTheme: "Arayüz Teması",
classic: "Klasik",
difficultyLevel: "Zorluk Seviyesi",
easy: "Kolay",
medium: "Orta",
hard: "Zor",
gameHistory: "Oyun Geçmişi",
noHistory: "Bu oyun için henüz bir geçmiş kaydınız bulunmamaktadır. Oynamaya başlayarak ilk kaydınızı oluşturun!",
play: "Oyna",
// i18n.js içinde (örneğin "tr" altında):
gameDescriptions: {
  'pixel-runner': 'Reflekslerini test etmeye hazır mısın? Pixel Runner, sonsuz bir koşu oyunudur...',
  'galaxy-invaders': 'Uzaylılar galaksiyi istila etti! Gemini güçlendir, yeni silahlar aç...',
  'cyber-sprint': 'Cyberpunk şehrinde hız kesmeden ilerle. Dijital tuzaklardan kaç...',
  'zombie-rush': 'Zombi kıyameti başladı! Kaynak topla, barınağını güçlendir...',
  'space-blaster': 'Uzayın derinliklerinde düşman filosuna karşı tek başınasın...',
  'ninja-escape': 'Bir tapınaktan kaçmakla görevli bir ninjasın...',
  'sky-surfer': 'Bulutların üstünde bir sörfçü olarak havada süzül...',
  'alien-attack': 'Uzaylılar dünyaya saldırıyor! Şehirleri koru...',
  'night-racer': 'Gece yarışları başladı! Neon ışıklarla dolu pistlerde drift yap...',
  'dragon-flight': 'Ejderhanla gökyüzüne hükmet! Düşman kalelerini yok et...',
  'city-defender': 'Şehrin son savunma hattı sensin. Dronlara karşı savunma kur...',
  'tower-dash': 'Yüksek bir kulede yukarı doğru zıplayarak ilerle...'
}




    }
  },
  en: {
    translation: {
      login: "Login",
      logout: "Logout",
      email: "Email",
      password: "Password",
      rememberMe: "Remember Me",
      forgotPassword: "Forgot Password",
      submit: "Submit",
      cancel: "Cancel",
      loading: "Loading...",
      errorOccurred: "An error occurred.",
      home: "Home",
      games: "Games",
      game: "Game", // Mevcuttu, korundu
      lobbies: "Lobbies",
      profile: "Profile",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      homeScreen: "Home Screen",
      createNewLobby: "Create New Lobby",
      noGamesFound: "No games found.",
      activeLobbies: "Active Lobbies",
      noActiveLobbies: "No active lobbies currently.",
      loadingGamesAndLobbies: "Loading games and lobbies...",
      loadingError: "Error occurred while loading data.",
      join: "Join",
      leave: "Leave",
      // Lobby.js
      lobbyName: "Lobby Name",
      selectGame: "Select Game",
      playerCount: "Player Count (2-10)",
      privateLobby: "Private Lobby",
      eventLobby: "Event Lobby",
      startTime: "Start Time",
      endTime: "End Time",
      lobbyPassword: "Lobby Password",
      createLobby: "Create Lobby",
      refresh: "Refresh",
      noLobbies: "No lobbies yet",
      activeLobbiesCount: "Active Lobbies ({{count}})",
      // LobbyDetail.js
      lobbyLink: "Lobby Link",
      players: "Players",
      status: "Status",
      private: "Private Lobby",
      public: "Public",
      eventLobbyLabel: "Event Lobby",
      eventEndsIn: "Event Ends In",
      owner: "Owner",
      participants: "Participants",
      joinLobby: "Join Lobby",
      leaveLobby: "Leave Lobby",
      deleteLobby: "Delete Lobby",
      editLobby: "Edit",
      confirmDeleteLobby: "Delete Lobby",
      deleteConfirmationMessage: "Are you sure you want to delete \"{{lobbyName}}\"?",
      // cancel: "Cancel", // Already in general section
      save: "Save",
      updateSuccess: "Lobby updated",
      deleteSuccess: "Lobby deleted",
      passwordRequired: "Password required to join this lobby",
      enterPassword: "Lobby Password",
      passwordError: "Incorrect password",
      // GameDetail.js
      howToPlay: "How to Play?",
      gameSettings: "Game Settings",
      soundEffects: "Sound Effects",
      uiTheme: "UI Theme",
      difficultyLevel: "Difficulty Level",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      gameHistory: "Game History",
      noHistory: "You don't have any history for this game yet. Start playing to create one!",
      startGame: "Start Game (Coming Soon)",
      play: "Play",
      loadingGame: "Loading game, please wait...",
      errorLoadingGame: "An error occurred while loading or game not found.",
      // Chat.js
      chat: "Chat",
      send: "Send",
      messagePlaceholder: "Type your message...",
      channelGeneral: "General",
      channelGame: "Game",
      channelLobby: "Lobby",
      channelPrivate: "Private",
      // Notifications
      notificationNewMessage: "New message received",
      notificationLobbyCreated: "New lobby created",
      // Other (Duplicates removed, unique ones kept)
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      startsIn: "Starts In:",
      eventOn: "Event On:",
      lobbyDeleted: "Lobby Deleted",
      delete: "Delete",
      deleting: "Deleting...",
      details: "Details",
      go: "Go",
      pasteLobbyLink: "Paste Lobby Link",
      // game: "Game", // Zaten yukarıda Navbar altında var ve doğru.
      linkCopied: "Link copied!",
      noOtherParticipants: "No other participants.",
      createLobbyTitle: "Create New Lobby",
      createLobbyBtn: "+ CREATE LOBBY",
      howToPlay: "How to Play?",
noInstructions: "There are no specific instructions for this game. Discover the general gameplay mechanics!",
gameSettings: "Game Settings",
soundEffects: "Sound Effects",
uiTheme: "UI Theme",
classic: "Classic",
difficultyLevel: "Difficulty Level",
easy: "Easy",
medium: "Medium",
hard: "Hard",
gameHistory: "Game History",
noHistory: "You don't have any history for this game yet. Start playing to create your first record!",
play: "Play",
gameDescriptions: {
  'pixel-runner': 'Ready to test your reflexes? Pixel Runner is an endless runner game...',
  'galaxy-invaders': 'Aliens have invaded the galaxy! Power up your ship and unlock new weapons...',
  'cyber-sprint': 'Run nonstop in a cyberpunk city. Dodge digital traps...',
  'zombie-rush': 'The zombie apocalypse has begun! Gather supplies and fortify your shelter...',
  'space-blaster': 'Alone against enemy fleets in deep space...',
  'ninja-escape': 'You are a ninja on a mission to escape from a temple...',
  'sky-surfer': 'Glide through the skies as a surfer above the clouds...',
  'alien-attack': 'Aliens are attacking Earth! Defend the cities...',
  'night-racer': 'Night races have begun! Drift through neon-lit tracks...',
  'dragon-flight': 'Rule the skies with your dragon! Destroy enemy castles...',
  'city-defender': 'You are the city’s last defense. Set up turrets against drones...',
  'tower-dash': 'Climb up a tall tower by jumping from platform to platform...'
}


    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr", // veya 'en' hangisini varsayılan istiyorsanız
    debug: process.env.NODE_ENV === 'development', // Geliştirme ortamında debug'ı açmak iyi olabilir
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;