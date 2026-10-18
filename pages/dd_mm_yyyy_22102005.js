// ===== NHẠC NỀN =====
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
musicBtn.onclick = () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicBtn.textContent = "⏸️ Tạm nínnn";
  } else {
    bgMusic.pause();
    musicBtn.textContent = "▶️ Tiếp đeee";
  }
};

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
document.getElementById("confettiBtn").onclick = () => startConfetti();
window.addEventListener("load", () => setTimeout(startConfetti, 500)); // bắn khi vào trang
