// ================== LẤY TRANG ĐÍCH ==================
const params = new URLSearchParams(window.location.search);
const targetPage = params.get("target") || "dd_mm_yyyy_28072005.html";

// ================== HELPERS ==================
function showStage(id) {
  document
    .querySelectorAll(".stage")
    .forEach((s) => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ================== DYNAMIC ISLAND ==================
const dynamicIsland = document.getElementById("dynamicIsland");
const islandText = document.getElementById("islandText");

async function flashIsland(text, duration = 2200) {
  islandText.textContent = text;
  dynamicIsland.classList.add("show");
  await wait(duration);
  dynamicIsland.classList.remove("show");
  await wait(400);
}

// ================== MATRIX RAIN NỀN ==================
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");
let matrixInterval = null;

function initMatrix() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const chars = "01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ$#%&";
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(1);

  matrixInterval = setInterval(() => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff6a";
    ctx.font = fontSize + "px monospace";

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }, 45);
}

function stopMatrix() {
  if (matrixInterval) clearInterval(matrixInterval);
}

window.addEventListener("resize", () => {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// ================== TERMINAL: GÕ DÒNG LỆNH ==================
const terminalBox = document.getElementById("terminalBox");

const terminalLines = [
  "> Đang truy cập quyền quản trị hệ thống...",
  "> Access granted.",
  "> Bypassing Face ID... [OK]",
  "> Accessing private photos...",
  "> Downloading banking data...",
  "> Cloning contact list... 247 contacts",
  "> Extracting message history...",
  "> Đang định vị vị trí thiết bị...",
  "> Uploading to server... [██████████] 100%",
  "> Đã tìm thấy 1 mục tiêu sinh nhật hôm nay 🎯",
];

async function runTerminal() {
  terminalBox.innerHTML = "";
  for (const line of terminalLines) {
    const div = document.createElement("div");
    div.className = "line";
    div.textContent = line;
    terminalBox.appendChild(div);
    await wait(750);
  }
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  terminalBox.appendChild(cursor);
  await wait(900);
}

// ================== CẢNH BÁO ĐỎ KIỂU SAFARI THẬT ==================
function showSafariWarning() {
  return new Promise((resolve) => {
    showStage("stage-safari");
    const goBack = document.getElementById("safariGoBack");
    const details = document.getElementById("safariDetails");

    const handler = (e) => {
      e.preventDefault();
      goBack.onclick = null;
      details.onclick = null;
      resolve();
    };

    goBack.onclick = handler;
    details.onclick = handler;
  });
}

// ================== POPUP DỒN DẬP KIỂU iOS ==================
const iosOverlay = document.getElementById("iosOverlay");
const iosModal = document.getElementById("iosModal");
const iosIcon = document.getElementById("iosIcon");
const iosTitle = document.getElementById("iosTitle");
const iosText = document.getElementById("iosText");
const iosButtons = document.getElementById("iosButtons");

function showPopup({ icon = "⚠️", title, text, buttons }) {
  return new Promise((resolve) => {
    iosIcon.textContent = icon;
    iosTitle.textContent = title;
    iosText.textContent = text;
    iosButtons.innerHTML = "";

    buttons.forEach((b, idx) => {
      const btn = document.createElement("button");
      btn.textContent = b.label;
      if (b.danger) btn.classList.add("danger");
      btn.onclick = () => {
        iosOverlay.classList.remove("active");
        resolve(idx);
      };
      iosButtons.appendChild(btn);
    });

    iosModal.classList.toggle("single", buttons.length === 1);
    iosOverlay.classList.add("active");
  });
}

// ================== COUNTDOWN ==================
const countdownNum = document.getElementById("countdownNum");

async function runCountdown(from = 5) {
  showStage("stage-countdown");
  for (let i = from; i >= 0; i--) {
    countdownNum.textContent = i;
    countdownNum.style.animation = "none";
    void countdownNum.offsetWidth;
    countdownNum.style.animation = "pop 0.3s ease";
    await wait(800);
  }
}

// ================== BOOM -> CHUYỂN TRANG ==================
async function boomAndRedirect() {
  const glitch = document.getElementById("glitchOverlay");
  glitch.classList.add("boom");
  await wait(650);
  window.location.href = targetPage;
}

// ================== KỊCH BẢN CHÍNH ==================
async function runSequence() {
  showStage("stage-loading");
  await wait(4500);

  await flashIsland("🔴 Camera & Micro đang được ghi lại bí mật", 2200);

  initMatrix();
  showStage("stage-terminal");
  await runTerminal();
  stopMatrix();

  // Cảnh báo đỏ full màn hình kiểu Safari thật
  await showSafariWarning();

  const cascade = [
    {
      icon: "🦠",
      title: "Virus Detected",
      text: "Phát hiện virus lạ đang hoạt động ngầm trên máy.",
    },
    { icon: "📤", title: "Đang gửi dữ liệu...", text: "Sending all photos..." },
    {
      icon: "⚔️",
      title: "Đang xóa tài khoản...",
      text: "Deleting Liên Quân account...",
    },
    { icon: "💌", title: "Đang thông báo...", text: "Notifying your crush..." },
    {
      icon: "🥴",
      title: "Rò rỉ dữ liệu",
      text: "Your search history has been leaked.",
    },
  ];

  for (const step of cascade) {
    await showPopup({
      icon: step.icon,
      title: step.title,
      text: step.text,
      buttons: [{ label: "OK", danger: true }],
    });
  }

  await wait(400);
  await runCountdown(5);
  await boomAndRedirect();
}

runSequence();
