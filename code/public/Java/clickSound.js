const clickSound = new Audio("/Sound/audio2.m4a");

function playClickSound() {
  const sound = clickSound.cloneNode();
  sound.volume = 0.2;
  sound.currentTime = 0; // luôn phát từ đầu
  sound.play();

  // ⏱️ dừng sau 1 giây
  setTimeout(() => {
    sound.pause();
    sound.currentTime = 0;
  }, 500);
}

document.addEventListener("click", playClickSound);
