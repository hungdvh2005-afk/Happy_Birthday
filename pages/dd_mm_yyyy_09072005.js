// Hiệu ứng particles nền
const canvas = document.createElement("canvas");
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "0";
document.body.insertBefore(canvas, document.body.firstChild);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.3 + 0.1;
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

const particles = [];
for (let i = 0; i < 60; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

// Hiệu ứng hover cho các info-item
document.querySelectorAll(".info-item").forEach((item, index) => {
  item.style.animationDelay = `${0.5 + index * 0.2}s`;
});

// Thêm hiệu ứng ripple khi click vào nút
document.querySelector(".back-btn").addEventListener("click", function (e) {
  const ripple = document.createElement("span");
  ripple.style.position = "absolute";
  ripple.style.borderRadius = "50%";
  ripple.style.background = "rgba(255, 255, 255, 0.6)";
  ripple.style.width = "100px";
  ripple.style.height = "100px";
  ripple.style.marginLeft = "-50px";
  ripple.style.marginTop = "-50px";
  ripple.style.animation = "ripple 0.6s";
  ripple.style.left = e.clientX - this.offsetLeft + "px";
  ripple.style.top = e.clientY - this.offsetTop + "px";

  this.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
});

// Animation CSS cho ripple
const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
    from {
      opacity: 1;
      transform: scale(0);
    }
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
`;
document.head.appendChild(style);
