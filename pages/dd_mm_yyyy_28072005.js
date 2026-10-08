// ===== NHẠC NỀN - TỰ ĐỘNG PHÁT =====
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isPlaying = false;

window.addEventListener("load", () => {
  setTimeout(() => {
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
        musicBtn.innerHTML =
          '<span class="icon">⏸️</span><span class="text">Tạm nínnn</span>';
      })
      .catch((err) => {
        console.log("Auto-play failed, user interaction required:", err);
      });
  }, 800);

  setTimeout(() => {
    startConfetti(8000, 500);
  }, 300);
});

musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    bgMusic.pause();
    musicBtn.innerHTML =
      '<span class="icon">▶️</span><span class="text">Tiếp đeee</span>';
  } else {
    bgMusic.play();
    musicBtn.innerHTML =
      '<span class="icon">⏸️</span><span class="text">Tạm nínnn</span>';
  }
  isPlaying = !isPlaying;
});

const overlay = document.getElementById("wishOverlay");
overlay.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// ===== ÂM THANH PHÁO GIẤY =====
const phaoSound = new Audio(
  "https://res.cloudinary.com/qpuqus9n/video/upload/v1791449159/phaogiay.mp3",
);
const loiChucSound = new Audio(
  "https://res.cloudinary.com/qpuqus9n/video/upload/v1791449158/loichuc.mp3",
);

function playPhaoSound() {
  phaoSound.currentTime = 0;
  phaoSound.play().catch((err) => console.log("Audio play failed:", err));
}

function playLoiChucSound() {
  loiChucSound.currentTime = 0;
  loiChucSound.play().catch((err) => console.log("Audio play failed:", err));
}

// ===== CONFETTI EFFECT =====
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Confetti {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 8 + 5;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.color = this.randomColor();
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
    this.opacity = 1;
  }

  randomColor() {
    const colors = [
      "#4facfe",
      "#00f2fe",
      "#667eea",
      "#764ba2",
      "#43e97b",
      "#38f9d7",
      "#f6d365",
      "#fda085",
      "#a1c4fd",
      "#c2e9fb",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    if (this.y > canvas.height) {
      this.y = -10;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

let confettiArray = [];
let isConfettiActive = false;
let confettiFadeTimeout = null;

function initConfetti(count = 150) {
  confettiArray = [];
  for (let i = 0; i < count; i++) {
    confettiArray.push(new Confetti());
  }
}

function animateConfetti() {
  if (!isConfettiActive && confettiArray.every((c) => c.opacity <= 0)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiArray.forEach((confetti) => {
    confetti.update();
    confetti.draw();
  });

  requestAnimationFrame(animateConfetti);
}

function fadeOutConfetti(duration = 2000) {
  const fadeStart = Date.now();

  function fade() {
    const elapsed = Date.now() - fadeStart;
    const progress = Math.min(elapsed / duration, 1);
    const opacity = 1 - progress;

    confettiArray.forEach((confetti) => {
      confetti.opacity = opacity;
    });

    if (progress < 1) {
      requestAnimationFrame(fade);
    } else {
      isConfettiActive = false;
      confettiArray = [];
    }
  }

  fade();
}

function startConfetti(duration = 10000, delay = 0) {
  if (confettiFadeTimeout) {
    clearTimeout(confettiFadeTimeout);
  }

  setTimeout(() => {
    initConfetti(200);
    isConfettiActive = true;
    confettiArray.forEach((c) => (c.opacity = 1));
    animateConfetti();

    confettiFadeTimeout = setTimeout(() => {
      fadeOutConfetti(2000);
    }, duration);
  }, delay);
}

document.getElementById("confettiBtn").addEventListener("click", () => {
  startConfetti(8000, 0);
});

// Tạm dừng nhạc nền khi bấm play video, để khỏi chồng tiếng
const memoryVideo = document.getElementById("memoryVideo");
if (memoryVideo) {
  memoryVideo.addEventListener("play", () => {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      musicBtn.innerHTML =
        '<span class="icon">▶️</span><span class="text">Tiếp đeee</span>';
    }
  });
}
