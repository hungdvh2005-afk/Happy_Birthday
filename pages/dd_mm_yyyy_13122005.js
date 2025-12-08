// Nút bắn pháo giấy
document.getElementById("confettiBtn").addEventListener("click", () => {
  playPhaoSound();
  setTimeout(() => {
    playLoiChucSound(); // Lời chúc phát sau 3 giây
  }, 3000);
  startConfetti(10000, 2000); // Delay 2 giây cho confetti rơi
}); // ===== NHẠC NỀN =====
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isPlaying = false;

musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    bgMusic.pause();
    musicBtn.innerHTML =
      '<span class="icon">🎵</span><span class="text">Lên nhạc!</span>';
  } else {
    bgMusic.play();
    musicBtn.innerHTML =
      '<span class="icon">⏸️</span><span class="text">Tạm nín!</span>';
  }
  isPlaying = !isPlaying;
});

// ===== ÂM THANH PHÁO GIẤY =====
const phaoSound = new Audio("../music/phaogiay.mp3");
const loiChucSound = new Audio("../music/loichuc.mp3");

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
      "#ff6b9d",
      "#c44569",
      "#f8b500",
      "#ffd93d",
      "#6bcf7f",
      "#4a90e2",
      "#9b59b6",
      "#e74c3c",
      "#3498db",
      "#1abc9c",
      "#f39c12",
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

    // Reset opacity cho tất cả confetti
    confettiArray.forEach((c) => (c.opacity = 1));

    animateConfetti();

    // Bắt đầu fade out sau thời gian duration
    confettiFadeTimeout = setTimeout(() => {
      fadeOutConfetti(2000); // Mờ dần trong 2 giây
    }, duration);
  }, delay);
}

// Nút bắn pháo giấy
document.getElementById("confettiBtn").addEventListener("click", () => {
  playPhaoSound();
  startConfetti(10000);
});

// ===== TỰ ĐỘNG CHẠY CONFETTI KHI VÀO TRANG =====
window.addEventListener("load", () => {
  setTimeout(() => {
    playPhaoSound();
    setTimeout(() => {
      playLoiChucSound(); // Lời chúc phát sau 3 giây
    }, 3000);
    startConfetti(8000, 2000); // Âm thanh phát ngay, confetti delay 2 giây
  }, 500);
});

// ===== HIỆU ỨNG PARTICLES NỀN =====
class Particle {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

let particles = [];

function initParticles() {
  particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  if (isConfettiActive || confettiArray.length > 0) {
    requestAnimationFrame(animateParticles);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
