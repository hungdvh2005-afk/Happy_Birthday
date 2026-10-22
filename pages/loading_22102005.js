const player = document.getElementById("player");
const startScreen = document.getElementById("startScreen");

// URL video tương ứng
const videoShortSrc =
  "https://res.cloudinary.com/qpuqus9n/video/upload/v1792138681/lv_0_20261016150713.mp4";
const videoFullSrc =
  "https://res.cloudinary.com/qpuqus9n/video/upload/v1792661888/lv_0_20261022132524.mp4";

// Trạng thái trang kế tiếp
let nextUrl = "";
let started = false;

// Fade rồi chuyển trang
const go = () => {
  document.body.classList.add("fade");
  setTimeout(() => (window.location.href = nextUrl), 300);
};

// Hàm xử lý chung khi bấm xem video
const playVideo = (src, redirectUrl) => {
  started = true;
  nextUrl = redirectUrl;
  startScreen.style.display = "none";
  player.style.display = "block"; // Hiển thị video khi bắt đầu

  player.src = src; // Nạp src tuỳ theo nút bấm
  player.play().catch(go); // chưa có video / bị lỗi thì sang luôn trang sau
};

// Bấm nút xem video ngay (Cũ)
document.getElementById("startBtn").onclick = () => {
  playVideo(videoShortSrc, "charge_22102005.html");
};

// Bấm nút xem video full (Mới)
document.getElementById("fullVideoBtn").onclick = () => {
  playVideo(videoFullSrc, "dd_mm_yyyy_22102005.html");
};

// Sự kiện kết thúc hoặc lỗi video
player.addEventListener("ended", go);
player.addEventListener("error", () => started && go());
// document.getElementById("skipBtn").onclick = go;
