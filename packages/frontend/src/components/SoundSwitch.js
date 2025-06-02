import React from 'react';
import Switch from '@mui/material/Switch';
import useSound from 'use-sound';

const SoundSwitch = ({ onChange, ...props }) => {
  const [playSwitch] = useSound('/sounds/switch.wav', { volume: 0.5 });

  const handleChange = (e, val) => {
    playSwitch();
    onChange?.(e, val);
  };

  return (
    <Switch onChange={handleChange} {...props} />
  );
};

export default SoundSwitch;
