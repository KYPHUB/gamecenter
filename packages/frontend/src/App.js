import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home'; // Home.js dosyasındaki ESLint uyarısını sonra düzeltebiliriz
import GameDetail from './pages/GameDetail';
import Lobby from './pages/Lobby';
import LobbyDetail from './pages/LobbyDetail';

function App() {
  // State'i başlangıçta null veya 'Kontrol ediliyor...' gibi bir şey yapabiliriz
  const [backendStatus, setBackendStatus] = useState('Kontrol ediliyor...');

  useEffect(() => {
    // Backend'deki doğru endpoint'e istek atıyoruz (/api/status)
    fetch('/api/status') // Proxy sayesinde otomatik olarak http://localhost:3001/api/status'a gidecek
      .then(async (res) => { // Cevabı async olarak işleyelim
          if (!res.ok) { // Eğer cevap başarısızsa (örn: 404, 500)
              const errorText = await res.text(); // Hata mesajını almaya çalışalım
              throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
          }
          return res.json(); // Başarılıysa JSON olarak parse et
      })
      .then((data) => {
          // Başarılı cevap gelirse (örn: { status: 'OK', message: '...' })
          console.log("Backend Status Response:", data);
          setBackendStatus(`✅ ${data.message || 'Bağlandı'}`); // Gelen mesajı veya varsayılanı göster
      })
      .catch((error) => {
          // Herhangi bir hata olursa (ağ hatası veya fetch/json hatası)
          console.error("Backend Status Error:", error);
          setBackendStatus('❌ Sunucuya ulaşılamadı'); // Hata durumunu göster
      });
  }, []); // Boş bağımlılık array'i ile sadece component yüklendiğinde çalışır

  return (
    <>
      <div style={{ backgroundColor: '#333', color: 'white', padding: '8px 16px', fontSize: '14px', textAlign: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
        {/* State adını backendStatus olarak değiştirdim */}
        Backend Durumu: {backendStatus}
      </div>
      <Router>
        <Routes>
          {/* Login sayfasının yolu genellikle "/" veya "/login" olur. */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game/:gameId" element={<GameDetail />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/lobby/:id" element={<LobbyDetail />} />
           {/* Ödevdeki /dashboard/app yolu için bir örnek ekleyelim */}
           {/* <Route path="/dashboard/app" element={<Home />} /> */}
           {/* veya */}
           {/* <Route path="/dashboard/*" element={<DashboardLayout />} /> */}

           {/* Eğer login başarılı olursa yönlenecek varsayılan bir yol tanımlamak gerekebilir */}
           {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;