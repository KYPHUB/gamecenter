import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      const username = email.split('@')[0];  // 👈 sadece @ öncesini al
      setUserEmail(username);
    }
  }, []);
  

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
          onClick={() => {
            localStorage.removeItem('isLoggedIn');
            navigate('/');
          }}
          
        >
          GameCenter
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/home')}>Ana Sayfa</Button>
          <Button color="inherit" onClick={() => navigate('/')}>Çıkış Yap</Button>
          <Typography sx={{ color: 'white', mr: 2 }}>
  👤 {userEmail}
</Typography>

        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
