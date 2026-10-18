// ===== NHẠC NỀN - TỰ ĐỘNG PHÁT =====
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

// Nhãn nút luôn đổi theo trạng thái thật của nhạc
bgMusic.addEventListener("play", () => (musicBtn.textContent = "⏸️ Tạm nínnn"));
bgMusic.addEventListener(
  "pause",
  () => (musicBtn.textContent = "▶️ Tiếp đeee"),
);

musicBtn.onclick = () => {
  if (bgMusic.paused) bgMusic.play().catch(() => {});
  else bgMusic.pause();
};

// Tự phát sau 6 giây khi vào trang
window.addEventListener("load", () => {
  setTimeout(() => {
    bgMusic.play().catch(() => {
      // Bị trình duyệt chặn thì phát ở lần chạm đầu tiên (trừ khi chạm đúng nút nhạc)
      addEventListener(
        "pointerdown",
        (e) => {
          if (!e.target.closest("#musicBtn")) bgMusic.play().catch(() => {});
        },
        { once: true },
      );
    });
  }, 6000);
});

// ===== ÂM THANH PHÁO + LỜI CHÚC =====
const phaoSound = new Audio(
  "https://res.cloudinary.com/qpuqus9n/video/upload/v1791449159/phaogiay.mp3",
);
const loiChucSound = new Audio(
  "https://res.cloudinary.com/qpuqus9n/video/upload/v1791449158/loichuc.mp3",
);
function playBang() {
  phaoSound.currentTime = 0;
  phaoSound.play().catch(() => {});
  setTimeout(() => {
    loiChucSound.currentTime = 0;
    loiChucSound.play().catch(() => {});
  }, 3000); // lời chúc vào sau 3s như bên 13122005
  setTimeout(startConfetti, 2000); // pháo giấy bung sau tiếng nổ 2s
}
// ===== PHÁO GIẤY =====
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const COLORS = [
  "#ff6b9d",
  "#f8b500",
  "#6bcf7f",
  "#4a90e2",
  "#9b59b6",
  "#e74c3c",
  "#1abc9c",
];
let pieces = [],
  running = false;
function fit() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
fit();
addEventListener("resize", fit);

function startConfetti(ms = 6000) {
  pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height,
    s: Math.random() * 8 + 5,
    vy: Math.random() * 3 + 2,
    vx: Math.random() * 2 - 1,
    r: Math.random() * 360,
    vr: Math.random() * 10 - 5,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
  if (!running) {
    running = true;
    loop();
  }
  setTimeout(() => (running = false), ms);
}
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!running) return;
  pieces.forEach((p) => {
    p.y += p.vy;
    p.x += p.vx;
    p.r += p.vr;
    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.r * Math.PI) / 180);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
    ctx.restore();
  });
  requestAnimationFrame(loop);
}
document.getElementById("confettiBtn").onclick = playBang;
window.addEventListener("load", () => setTimeout(playBang, 500));
