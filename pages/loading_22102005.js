const NEXT = "charge_22102005.html"; // trang kế tiếp: game cắm sạc
const player = document.getElementById("player");
const startScreen = document.getElementById("startScreen");
let started = false;

// Fade rồi chuyển trang
const go = () => {
  document.body.classList.add("fade");
  setTimeout(() => (window.location.href = NEXT), 300);
};

// Cú bấm này mở khóa âm thanh trên mobile
document.getElementById("startBtn").onclick = () => {
  started = true;
  startScreen.style.display = "none";
  player.play().catch(go); // chưa có video / bị lỗi thì sang luôn trang sau
};

player.addEventListener("ended", go);
player.addEventListener("error", () => started && go());
// document.getElementById("skipBtn").onclick = go;
