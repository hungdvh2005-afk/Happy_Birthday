// ===== KÍCH HOẠT ICON BAY (MỜ DẦN KHI BAY LÊN TRÊN) =====
function initFloatingIcons() {
  const floatLayer = document.getElementById("floatLayer");
  // Các icon chủ đề: Mưa, em gái, điện thoại, sạc dây, sạc dự phòng, giọt nước...
  const icons = ["🌧️", "👧", "📱", "🔌", "🔋", "💧", "🌧️", "📱", "🔋"];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const item = document.createElement("span");
    item.className = "float-item";
    item.textContent = icons[i % icons.length];

    item.style.left = Math.random() * 100 + "%";
    item.style.fontSize = 18 + Math.random() * 20 + "px";
    item.style.animationDuration = 8 + Math.random() * 10 + "s";
    item.style.animationDelay = -Math.random() * 12 + "s";

    floatLayer.appendChild(item);
  }
}
initFloatingIcons();

// ===== NHẠC NỀN & PHÁO GIẤY =====
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
      .catch((err) => console.log("Cần tương tác để phát nhạc:", err));
  }, 6000);

  setTimeout(() => {
    playPhaoSound();
    setTimeout(playLoiChucSound, 3000);
    startConfetti(8000, 2000);
  }, 500);
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

// ===== LOGIC LỚP PHỦ QUIZ CÂU HỎI =====
const quizOverlay = document.getElementById("quizOverlay");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
let yesScale = 1,
  noScale = 1;

noBtn.addEventListener("click", () => {
  yesScale = Math.min(yesScale + 0.25, 2.2);
  noScale = Math.max(noScale - 0.15, 0.35);
  yesBtn.style.setProperty("--s", yesScale);
  noBtn.style.setProperty("--s", noScale);
});

yesBtn.addEventListener("click", () => {
  quizOverlay.classList.add("hide");
  startConfetti(6000, 0);
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
  phaoSound.play().catch(() => {});
}

function playLoiChucSound() {
  loiChucSound.currentTime = 0;
  loiChucSound.play().catch(() => {});
}

// ===== CANVAS CONFETTI EFFECT =====
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
      "#f8b500",
      "#6bcf7f",
      "#4a90e2",
      "#9b59b6",
      "#e74c3c",
      "#1abc9c",
      "#8f7fe8",
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
  confettiArray.forEach((c) => {
    c.update();
    c.draw();
  });

  requestAnimationFrame(animateConfetti);
}

function fadeOutConfetti(duration = 2000) {
  const fadeStart = Date.now();

  function fade() {
    const elapsed = Date.now() - fadeStart;
    const progress = Math.min(elapsed / duration, 1);
    const opacity = 1 - progress;

    confettiArray.forEach((c) => (c.opacity = opacity));

    if (progress < 1) {
      requestAnimationFrame(fade);
    } else {
      isConfettiActive = false;
      confettiArray = [];
    }
  }
  fade();
}

function startConfetti(duration = 8000, delay = 0) {
  if (confettiFadeTimeout) clearTimeout(confettiFadeTimeout);

  setTimeout(() => {
    initConfetti(180);
    isConfettiActive = true;
    animateConfetti();

    confettiFadeTimeout = setTimeout(() => {
      fadeOutConfetti(2000);
    }, duration);
  }, delay);
}

document.getElementById("confettiBtn").addEventListener("click", () => {
  playPhaoSound();
  setTimeout(playLoiChucSound, 3000);
  startConfetti(8000, 2000);
});
