import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email;
    if (email) {
      const username = email.split('@')[0];
      setUserEmail(username);
    }
  }, []);

  // Çıkış yapma fonksiyonu
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.removeItem('user');
        navigate('/');
      } else {
        alert("Çıkış yapılamadı: " + data.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert("Sunucuya ulaşılamadı.");
    }
  };
  

  return (
    <AppBar position="static" sx={{ background: '#1e1e2f' }}>
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/home')}
        >
          GameCenter
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" onClick={() => navigate('/home')}>
            Ana Sayfa
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Çıkış Yap
          </Button>
          {userEmail && (
            <Typography sx={{ ml: 2 }}>
              👤 {userEmail}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
