import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

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
        <Box>
          <Button color="inherit" onClick={() => navigate('/home')}>Ana Sayfa</Button>
          <Button color="inherit" onClick={() => navigate('/')}>Çıkış Yap</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
