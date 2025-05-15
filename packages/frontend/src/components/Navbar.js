import React from 'react'; // useEffect ve useState'e artık gerek yok
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // RouterLink eklendi
import { useAuth } from '../context/AuthContext'; // <<<--- AuthContext hook'unu import ettik

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // <<<--- Context'ten user ve logout fonksiyonunu aldık

  // Çıkış yapma fonksiyonu - Artık Context'i kullanıyor
  const handleLogout = async () => {
    try {
      await logout(); // <<<--- Context'teki logout fonksiyonunu çağırıyoruz
      // Yönlendirme genellikle context değişikliği veya protected route tarafından yapılır,
      // ama garanti olsun diye burada da yapabiliriz.
      console.log("Navbar'dan çıkış yapıldı.");
      navigate('/login', { replace: true }); // Login sayfasına yönlendir
    } catch (error) {
      console.error('Navbar Logout error:', error);
      alert("Çıkış yaparken bir hata oluştu."); // Kullanıcıya bilgi ver
    }
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(to right, #2c5364, #203a43, #0f2027)' }}> {/* Önceki örnekteki gibi gradient */}
      <Toolbar>
        {/* Logo/Başlık - Tıklanabilir Link */}
        <Typography
          variant="h5" // Biraz küçülttük
          component={RouterLink} // Tıklanabilir link
          to={user ? "/home" : "/login"} // Duruma göre yönlendir
          sx={{
            flexGrow: 1,
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 'bold',
            color: 'white', // Renk belirttik
            textDecoration: 'none' // Link alt çizgisini kaldırdık
          }}
        >
          GameCenter
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* Butonlar arasına boşluk */}
          {/* Ana Sayfa Butonu (Her zaman görünebilir veya sadece login olunca) */}
          {user && ( // Sadece kullanıcı varsa gösterelim
             <Button
               color="inherit"
               component={RouterLink} // Link olarak davran
               to="/home"
               sx={{ color: '#e0e0e0' }} // Renk
            >
               Ana Sayfa
             </Button>
          )}

          {/* Kullanıcı Bilgisi ve Çıkış Butonu (Login olmuşsa) */}
          {user ? (
            <>
              <Typography sx={{ color: '#e0e0e0', display: { xs: 'none', sm: 'block' } }}> {/* Küçük ekranlarda gizle (opsiyonel) */}
                 👤 {user.email} {/* Context'ten gelen email */}
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                variant="outlined" // Stil
                sx={{ borderColor: '#e0e0e0', color:'#e0e0e0' }}
              >
                Çıkış Yap
              </Button>
            </>
          ) : (
            // Giriş Yap Butonu (Login olmamışsa)
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              variant="outlined" // Stil
              sx={{ borderColor: '#e0e0e0', color:'#e0e0e0' }}
            >
              Giriş Yap
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;