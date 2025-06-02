import React from 'react';
import Button from '@mui/material/Button';
import useSound from 'use-sound';

const SoundButton = ({ children, onClick, ...props }) => {
  const [playClick] = useSound('/sounds/button_click.mp3', { volume: 0.5 });

  const handleClick = (e) => {
    playClick();
    onClick?.(e);
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};

export default SoundButton;
