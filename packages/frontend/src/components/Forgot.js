const forgotSound = new Audio('/sounds/forgot.mp3'); // ← Ses dosyasının adını buraya yazıcaz

export const playForgotSound = () => {
  forgotSound.currentTime = 0;
  forgotSound.play();
};
