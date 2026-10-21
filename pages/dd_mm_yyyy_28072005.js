// ===== KHỞI TẠO ICON GAME, NGHỆ THUẬT, CỌ VẼ BAY MỜ DẦN =====
function initFloatingIcons() {
  const floatLayer = document.getElementById("floatLayer");
  // Các icon chuyên biệt: Máy chơi game, bảng màu, cọ vẽ, khung tranh, dải sáng, tranh vẽ
  const icons = ["🎮", "🎨", "🖌️", "🖼️", "✨", "🕹️", "🎨", "🖌️", "✨"];
  const count = 20;

  for (let i = 0; i < count; i++) {
    const item = document.createElement("span");
    item.className = "float-item";
    item.textContent = icons[i % icons.length];

    item.style.left = Math.random() * 100 + "%";
    item.style.fontSize = 20 + Math.random() * 22 + "px";
    item.style.animationDuration = 8 + Math.random() * 10 + "s";
    item.style.animationDelay = -Math.random() * 12 + "s";

    floatLayer.appendChild(item);
  }
}
initFloatingIcons();

// ===== ĐIỀU KHIỂN NHẠC NỀN & PHÁO GIẤY =====
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isPlaying = false;

window.addEventListener("load", () => {
  // Tự động phát nhạc sau khi vào trang
  setTimeout(() => {
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
        musicBtn.innerHTML =
          '<span class="icon">⏸️</span><span class="text">Tạm nínnn</span>';
      })
      .catch((err) =>
        console.log("Cần tương tác người dùng để phát nhạc:", err),
      );
  }, 800);

  // Pháo giấy tự bung ban đầu
  setTimeout(() => {
    startConfetti(8000, 300);
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

// Touch / Bấm Bụp Cover để mở thư
const wishOverlay = document.getElementById("wishOverlay");
if (wishOverlay) {
  wishOverlay.addEventListener("click", () => {
    wishOverlay.classList.add("hidden");
    startConfetti(6000, 0);
  });
}

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
    // Các dải màu tươi sáng nghệ thuật
    const colors = [
      "#ff6b6b",
      "#ff8e53",
      "#f8b500",
      "#4a90e2",
      "#ffbe76",
      "#ff7979",
      "#badc58",
      "#e056fd",
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

function initConfetti(count = 160) {
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

// Tạm dừng nhạc nền khi bật xem Video kỷ niệm
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
