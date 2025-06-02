const notifySound = new Audio('/sounds/notification.mp3');

export const NotifySound = () => {
  notifySound.currentTime = 0;
  notifySound.play();
};

export default NotifySound;
