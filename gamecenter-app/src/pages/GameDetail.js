import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';



const gameDetails = {
  'pixel-runner': {
    name: 'Pixel Runner',
    description: 'Reflekslerini test etmeye hazır mısın? Pixel Runner, sonsuz bir koşu oyunudur. Engellerden kaç, hızlandıkça zorluk artsın. Her koşuda rekor kır ve liderlik tablosunda zirveye oyna!',
    image: '/images/pixel-runner.jpg',
  },
  'galaxy-invaders': {
    name: 'Galaxy Invaders',
    description: 'Uzaylılar galaksiyi istila etti! Gemini güçlendir, yeni silahlar aç. Bölüm sonu canavarlarına karşı stratejik hamleler yap. Işın topları, kalkanlar ve yükseltmelerle savaşta üstünlük kur.',
    image: '/images/galaxy-invaders.jpg',
  },
  'cyber-sprint': {
    name: 'Cyber Sprint',
    description: 'Cyberpunk şehrinde hız kesmeden ilerle. Dijital tuzaklardan kaç, kod bloklarını topla ve hız moduna geç. Işıklarla dolu bu şehirde ritme ayak uydurarak sprint yeteneklerini geliştir.',
    image: '/images/cyber-sprint.jpg',
  },
  'zombie-rush': {
    name: 'Zombie Rush',
    description: 'Zombi kıyameti başladı! Kaynak topla, barınağını güçlendir ve hayatta kalanları kurtar. Her dalgada daha güçlü zombiler geliyor, cephaneliğini hazırlayıp savunma hattı kurmalısın.',
    image: '/images/zombie-rush.jpg',
  },
  'space-blaster': {
    name: 'Space Blaster',
    description: 'Uzayın derinliklerinde düşman filosuna karşı tek başınasın. Lazer silahlarını geliştir, hiper hıza geç ve boss gemilerle yüzleş. Asteroit alanlarından sağ çıkabilecek misin?',
    image: '/images/space-blaster.jpg',
  },
  'ninja-escape': {
    name: 'Ninja Escape',
    description: 'Bir tapınaktan kaçmakla görevli bir ninjasın. Sessiz ol, tuzaklardan kaç, gölgeleri kullan. Zamanlama ve refleks senin en büyük silahların. Düşman seni fark etmeden kaçmayı başar!',
    image: '/images/ninja-escape.jpg',
  },
  'sky-surfer': {
    name: 'Sky Surfer',
    description: 'Bulutların üstünde bir sörfçü olarak havada süzül. Rüzgar akımlarını kullan, yıldırım bulutlarından uzak dur. Gökyüzündeki halkalardan geçerek puan topla ve seviyeleri tamamla.',
    image: '/images/sky-surfer.jpg',
  },
  'alien-attack': {
    name: 'Alien Attack',
    description: 'Uzaylılar dünyaya saldırıyor! Şehirleri koru, savunma kuleleri kur ve düşman gemilerini yok et. Her galibiyetle yeni bölgelerin kilidini aç ve teknolojini geliştir.',
    image: '/images/alien-attack.jpg',
  },
  'night-racer': {
    name: 'Night Racer',
    description: 'Gece yarışları başladı! Neon ışıklarla dolu pistlerde drift yap, rakiplerini geride bırak. Nitro kullan, tuzaklardan kaç ve birinci olmak için en iyi zamanlamanı göster.',
    image: '/images/night-racer.jpg',
  },
  'dragon-flight': {
    name: 'Dragon Flight',
    description: 'Ejderhanla gökyüzüne hükmet! Düşman kalelerini yok et, hazineleri topla. Ateş topu saldırıları yap, gökyüzündeki engelleri aşarak en uzak diyarları keşfet.',
    image: '/images/dragon-flight.jpg',
  },
  'city-defender': {
    name: 'City Defender',
    description: 'Şehrin son savunma hattı sensin. Dronlar, tanklar ve robotlara karşı taktiksel savunmalar kur. Kulelerini geliştir, düşman dalgalarını savuştur ve halkı koru.',
    image: '/images/city-defender.jpg',
  },
  'tower-dash': {
    name: 'Tower Dash',
    description: 'Yüksek bir kulede yukarı doğru zıplayarak ilerle. Dönen platformlar, lazer engeller ve zamanlayıcılar seni bekliyor. Hızlı ol ve düşmeden zirveye ulaş!',
    image: '/images/tower-dash.jpg',
  },
};


function GameDetail() { 
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = gameDetails[gameId];


  if (!game) {
    return (
      <Box sx={{ padding: 4, backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
        <Navbar />
        <Typography variant="h5">Oyun bulunamadı.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
<Box
  sx={{
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    minHeight: '100vh',
    padding: 6,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  }}
>
  <Typography
    variant="h3"
    align="center"
    gutterBottom
    sx={{
      fontFamily: 'Orbitron, sans-serif',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #00c9ff, #92fe9d)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    {game.name}
  </Typography>
        <img
          src={game.image}
          alt={game.title}
          style={{ width: '100%', maxWidth: 400, borderRadius: 12 }}
        />
        <Typography variant="body1" sx={{ fontSize: 18, textAlign: 'center', maxWidth: 800 }}>
          {game.description}
        </Typography>
        <Button
  variant="contained"
  color="primary"
  size="large"
  onClick={() => navigate(`/lobby`)}
>
  Oyna
</Button>


      </Box>
    </>
  );
}

export default GameDetail;
