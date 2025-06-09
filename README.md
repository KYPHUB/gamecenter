# 🎮 GameCenter

GameCenter, çok oyunculu web tabanlı oyunlar oynayabileceğiniz, her oyuna özel lobi oluşturabileceğiniz ve kullanıcı oturumu ile yönetilen bir platformdur. Proje, gerçek zamanlı etkileşim (WebSocket), çoklu dil desteği, tema geçişi ve modüler oyun yapısı gibi birçok gelişmiş özelliğe sahiptir.

## 🚀 Özellikler

* Kullanıcı e-posta ve şifre ile giriş yapabilir
* “Beni hatırla” ve “Şifremi unuttum” gibi giriş deneyimi özellikleri
* Ana sayfada listelenen oyunlar (görsel + ad)
* Her oyun için detay sayfası ve “Nasıl oynanır” açıklamaları
* Lobi oluşturma (etkinlik, şifreli, normal) ve mevcut lobiye katılma
* Lobide katılımcı listesi ve kurucu kontrolü
* Tombala oyunu: Gerçek zamanlı, çok oyunculu, WebSocket destekli
* Koyu/açık tema ve çoklu dil (Türkçe – İngilizce) desteği
* Responsive tasarım ile farklı cihazlarda uyumlu görünüm

## 🛠️ Kullanılan Teknolojiler

### Frontend

* React 18 + Context API
* Material UI v6
* react-router-dom
* react-i18next
* Socket.IO client

### Backend

* Node.js v22 + Express v5
* express-session + memorystore
* Socket.IO
* SHA-256 hash ile kullanıcı doğrulama
* Lerna monorepo yapısı (oyunlar ayrı paket olarak tanımlı)

## 👨‍💻 Geliştirici

Kerem Yunus Parlakyiğit
Sakarya Üniversitesi – Bilgisayar Mühendisliği

## ⚙️ Kurulum ve Çalıştırma

1. Projeyi bir klasöre indirin (örnek: `Platform/`, tombala-game klasörü de bu klasörün içinde olmalı)
2. Terminali proje kök dizinine açın

### Bağımlılıkları yüklemek için

npm install

### Frontend’i başlatmak için

npm run start --workspace gamecenter/packages/frontend

### Backend’i başlatmak için

npm run start --workspace gamecenter/packages/backend

### Tombala oyununu derlemek için

npm run build --workspace tombala-game

### Uygulamayı açmak için

Tarayıcıdan [http://localhost:3000](http://localhost:3000) adresine gidin.

## 🧪 Test Girişi (Dummy Kullanıcılar)
* Test amaçlı kullanabileceğiniz hazır kullanıcılar:

* Kullanıcı 1

* E-posta: test@test.com

* Şifre: 06Sh1854

* Kullanıcı 2

* E-posta: admin@test.com

* Şifre: admin123

