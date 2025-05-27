// packages/frontend/src/components/Countdown.js
import React, { useEffect, useState } from 'react';
import { getRemainingTime } from '../utils/timeUtils';

export default function Countdown({ target }) {
  const [timeLeft, setTimeLeft] = useState(getRemainingTime(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const { hours, minutes, seconds } = timeLeft;

  if (hours === 0 && minutes === 0 && seconds === 0) return <span style={{ color: '#ff5722' }}>⏰ Süre doldu</span>;

  return (
    <span style={{ fontWeight: 500, color: '#ffc107' }}>
      {hours > 0 && `${hours} sa `}
      {minutes > 0 && `${minutes} dk `}
      {seconds}s
    </span>
  );
}
