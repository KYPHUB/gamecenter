export function formatDuration(minutes) {
    if (minutes < 60) return `${minutes} dakika`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} saat${mins > 0 ? ` ${mins} dakika` : ''}`;
  }
  