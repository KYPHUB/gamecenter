// packages/frontend/src/utils/timeUtils.js

export function getRemainingTime(targetDate) {
  const now = new Date();
  const end = new Date(targetDate);
  const diff = end - now;

  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60));

  return { hours, minutes, seconds };
}
