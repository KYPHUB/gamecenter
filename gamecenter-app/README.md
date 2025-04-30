# Oyun Merkezi

Şirket etkinliklerinde veya personellerin oynayabileceği çeşitli oyunların listelendiği ve lobi sistemi üzerinden birlikte oynanabildiği bir Web / Mobile frontend platformudur. Bu depo, projenin frontend (React) ve backend (Node.js) kısımlarını içermektedir.

## Mevcut Özellikler

*   **Kullanıcı Giriş/Çıkış:** E-posta ve şifre ile güvenli giriş yapma ve oturumu sonlandırma (Backend'de session tabanlı).
*   **Backend Durum Kontrolü:** Frontend'in backend sunucusuna erişip erişemediğini gösteren durum bilgisi.
*   **Oyun Listeleme:** Backend'den çekilen mevcut oyunların ana ekranda listelenmesi.
*   **Aktif Lobi Listeleme:** Backend'den çekilen aktif lobilerin ana ekranda veya lobi sayfasında listelenmesi.
*   **Yeni Lobi Oluşturma:** Kullanıcıların yeni bir oyun lobisi oluşturabilmesi (Lobi Adı, Oyun, Oyuncu Sayısı, Özel Durumu).
*   **Lobi Detaylarını Görüntüleme:** Listelenen bir lobiye tıklandığında (veya "Katıl" butonuna basıldığında) lobi detaylarının gösterilmesi.
*   **Oyun Detaylarını Görüntüleme:** Listelenen bir oyuna tıklandığında oyun detaylarının gösterilmesi.
*   **Korunan Sayfalar (Protected Routes):** Ana ekran, lobi, oyun detayları gibi sayfalara erişim için kullanıcı girişi gerekliliği.

## Kullanılan Teknolojiler

### Frontend (`gamecenter-app/`)

*   **React (~v19):** Kullanıcı arayüzü kütüphanesi.
*   **React Router DOM v6:** Sayfa yönlendirmeleri için.
*   **Material UI (MUI) ~v7:** Hazır UI bileşenleri ve tema desteği için.
    *   `@mui/material`
    *   `@mui/icons-material` (İkonlar için)
*   **Axios:** Backend API'sine HTTP istekleri yapmak için.
*   **React Context API:** Global state yönetimi (kullanıcı oturum bilgisi vb.) için.
*   **Create React App:** Proje iskeleti ve geliştirme araçları.

### Backend (`packages/server/`)

*   **Node.js:** Çalışma ortamı.
*   **Express:** Web framework'ü (API oluşturmak için).
*   **Express-Session:** Kullanıcı oturumlarını yönetmek için.
*   **Memorystore:** Session verilerini geliştirme ortamında hafızada saklamak için.
*   **Cors:** Frontend'den gelen isteklere izin vermek için.
*   **Nodemon:** Geliştirme sırasında sunucuyu otomatik yeniden başlatmak için.

## Proje Yapısı

Proje ana olarak iki kısımdan oluşmaktadır:

*   `gamecenter-app/`: Frontend React uygulamasını içerir (UI, sayfalar, component'ler).
*   `packages/server/`: Backend Node.js/Express API sunucusunu içerir (API endpoint'leri, session yönetimi, dummy data).
    *(Not: Proje başlangıçta Lerna monorepo olarak düşünülmüş olabilir ancak mevcut yapıda frontend `packages` dışındadır.)*

## Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları takip edin:

1.  **Node.js ve npm/yarn yükleyin:** Henüz yüklü değilse [Node.js](https://nodejs.org/) adresinden indirin (npm genellikle birlikte gelir).
2.  **Depoyu klonlayın:**
    ```bash
    git clone https://github.com/KYPHUB/gamecenter.git
    cd gamecenter
    ```
3.  **Backend bağımlılıklarını yükleyin:**
    ```bash
    cd packages/server
    npm install
    cd ../..
    ```
4.  **Frontend bağımlılıklarını yükleyin:**
    ```bash
    cd gamecenter-app
    npm install
    cd ..
    ```

## Projeyi Çalıştırma

Kurulum tamamlandıktan sonra projeyi başlatmak için **iki ayrı terminal** açmanız gerekmektedir:

1.  **Backend Sunucusunu Başlatma:**
    ```bash
    cd packages/server
    npm start
    ```
    *Sunucu varsayılan olarak `http://localhost:3001` adresinde çalışacaktır.*

2.  **Frontend Uygulamasını Başlatma:**
    ```bash
    cd gamecenter-app
    npm start
    ```
    *Uygulama varsayılan olarak `http://localhost:3000` adresinde açılacaktır.*

Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görebilirsiniz.

**Test Kullanıcısı:**
*   E-posta: `test@test.com`
*   Şifre: `password`

## Kullanılabilir Scriptler

### Frontend (`gamecenter-app` klasöründe)

*   `npm start`: Uygulamayı geliştirme modunda başlatır.
*   `npm run build`: Uygulamayı üretim için `build` klasörüne derler.
*   `npm test`: Testleri çalıştırır.

### Backend (`packages/server` klasöründe)

*   `npm start`: Sunucuyu `nodemon` ile geliştirme modunda başlatır (dosya değişikliklerinde otomatik yeniden başlar).