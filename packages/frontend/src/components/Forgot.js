const forgotSound = new Audio('/sounds/forgot.mp3'); // ← Ses dosyasının adını buraya yaz

export const playForgotSound = () => {
  forgotSound.currentTime = 0;
  forgotSound.play();
};
