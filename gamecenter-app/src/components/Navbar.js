import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) {
      const username = user.email.split('@')[0];  
      setUserEmail(username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
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
          <Button color="inherit" onClick={() => navigate('/home')}>Ana Sayfa</Button>
          <Button color="inherit" onClick={handleLogout}>Çıkış Yap</Button>
          
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
