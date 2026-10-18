// ===== CẤU HÌNH (sửa ở đây) =====
const MSG = {
  hold: "Đố cắm sạc được đếy, chan đi",
  fails: [
    "Không đúng cáp sạc òi",
    "Cáp sạc qua nhiều lần dùng bị lỏng, cần chặt vào!",
    "sạc bị dính nước, khô rồi hãy cắm lại!",
  ],
  done: "Sạc đầy rồi, vào play together thoi🔋",
};
const CHARGE_MS = 5000; // thời gian pin chạy 5% -> 100%
const START_PCT = 5;
const FAILS_BEFORE_SUCCESS = 3; // số lần cắm bị rơi, lần kế tiếp sẽ thành công
const SKIP_AFTER = 6;
const SNAP = 26; // khoảng cách (px) đầu cáp tới cổng sạc thì tính là cắm
const FOLLOW = 0.14; // điện thoại đuổi theo cáp: nhỏ = trễ/đàn hồi hơn
const NEXT = "dd_mm_yyyy_22102005.html";

const $ = (id) => document.getElementById(id);
const phone = $("phone"),
  body = $("body"),
  plug = $("plug"),
  wire = $("wire");
const toastEl = $("toast");
//   skip = $("skip");
let W, H, PW, PH;
let ph = { x: 0, y: 0, tx: 0, ty: 0 }; // vị trí điện thoại (x,y) và đích (tx,ty)
let pl = { x: 0, y: 0 }; // tâm đầu cáp
let drag = null,
  hold = null,
  toggled = false,
  space = false;
let validTries = 0,
  tries = 0,
  busy = false,
  done = false,
  toastT,
  tinged = false;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pinned = () => hold !== null || toggled || space;
const port = () => ({ x: ph.x + PW / 2, y: ph.y + PH - 10 });

function snd(name) {
  try {
    new Audio(`../music/${name}.mp3`).play().catch(() => {});
  } catch (e) {}
}
function toast(msg, ms = 2000) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove("show"), ms);
}
function count() {
  tries++;
  //   if (tries > SKIP_AFTER) skip.hidden = false;
}
function updPin() {
  body.classList.toggle("pinned", pinned());
}

function layout() {
  W = innerWidth;
  H = innerHeight;
  PW = Math.min(W * 0.46, 180);
  PH = PW * 1.85;
  if (PH > H * 0.5) {
    PH = H * 0.5;
    PW = PH / 1.85;
  }
  phone.style.width = PW + "px";
  phone.style.height = PH + "px";
  reset();
}
function reset() {
  body.classList.remove("fall");
  toggled = false;
  busy = false;
  ph.x = ph.tx = (W - PW) / 2;
  ph.y = ph.ty = H * 0.12;
  pl.x = W / 2;
  pl.y = H * 0.82;
  updPin();
}

// ===== ĐIỀU KHIỂN =====
plug.addEventListener("pointerdown", (e) => {
  if (busy || done) return;
  drag = { id: e.pointerId, ox: e.clientX - pl.x, oy: e.clientY - pl.y };
  plug.setPointerCapture(e.pointerId);
  if (!tinged) {
    tinged = true;
    snd("ting");
  }
});
phone.addEventListener("pointerdown", (e) => {
  if (busy || done) return;
  if (e.pointerType === "mouse")
    toggled = !toggled; // laptop: bấm để ghim/bỏ ghim
  else {
    hold = e.pointerId;
    phone.setPointerCapture(e.pointerId);
  } // cảm ứng: giữ ngón
  updPin();
});
addEventListener("pointermove", (e) => {
  if (!drag || e.pointerId !== drag.id || busy) return;
  const nx = clamp(e.clientX - drag.ox, 17, W - 17);
  const ny = clamp(e.clientY - drag.oy, 40, H - 32);
  const dx = nx - pl.x,
    dy = ny - pl.y;
  pl.x = nx;
  pl.y = ny;
  if (!pinned()) {
    // không giữ thì điện thoại bị kéo theo cáp
    ph.tx = clamp(ph.tx + dx, 0, W - PW);
    ph.ty = clamp(ph.ty + dy, 40, H - PH - 70);
  }
});
function release(e) {
  if (hold === e.pointerId) hold = null;
  if (drag && drag.id === e.pointerId) drag = null;
  updPin();
}
addEventListener("pointerup", release);
addEventListener("pointercancel", release);
addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    space = true;
    updPin();
    e.preventDefault();
  }
});
addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    space = false;
    updPin();
  }
});
// skip.onclick = () => (location.href = NEXT);
addEventListener("resize", layout);

// ===== LUẬT CHƠI =====
function pushAway() {
  // chưa giữ điện thoại mà cắm: đẩy điện thoại ra xa
  busy = true;
  ph.ty = clamp(ph.ty - 130, 40, H - PH - 70);
  toast(MSG.hold);
  count();
  setTimeout(() => (busy = false), 700);
}
function connect() {
  busy = true;
  drag = null;
  const p = port();
  pl.x = p.x;
  pl.y = p.y + 32; // đầu cáp dính vào cổng
  validTries++;
  if (validTries <= FAILS_BEFORE_SUCCESS) {
    count();
    setTimeout(() => {
      snd("rotra");
      body.classList.add("fall");
      toast(MSG.fails[Math.min(validTries, MSG.fails.length) - 1]);
      setTimeout(reset, 1100);
    }, 500);
  } else charge();
}
function charge() {
  done = true;
  //   skip.hidden = true;
  snd("charge");
  body.classList.add("charging");
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / CHARGE_MS, 1);
    const pct = Math.round(START_PCT + (100 - START_PCT) * p);
    $("pct").textContent = pct + "%";
    $("fill").style.width = pct + "%";
    $("screen").style.setProperty("--c", `hsl(${p * 120}, 85%, 52%)`);
    if (p < 1) requestAnimationFrame(tick);
    else boom();
  })(t0);
}
function boom() {
  $("flash").classList.add("go");
  snd("bum");
  for (let i = 0; i < 50; i++) {
    const c = document.createElement("i");
    c.className = "cf";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
    c.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(c);
  }
  toast(MSG.done, 2500);
  setTimeout(() => {
    document.body.style.opacity = 0;
    setTimeout(() => (location.href = NEXT), 500);
  }, 2400);
}

// ===== VÒNG LẶP VẼ =====
function frame() {
  ph.x += (ph.tx - ph.x) * FOLLOW;
  ph.y += (ph.ty - ph.y) * FOLLOW;
  phone.style.transform = `translate(${ph.x}px,${ph.y}px)`;
  plug.style.transform = `translate(${pl.x - 17}px,${pl.y - 32}px)`;
  const my = (H + pl.y) / 2;
  wire.setAttribute(
    "d",
    `M${W / 2} ${H + 10} C${W / 2} ${my},${pl.x} ${my},${pl.x} ${pl.y + 30}`,
  );
  if (!busy && !done && drag) {
    const p = port();
    const d = Math.hypot(pl.x - p.x, pl.y - 32 - p.y);
    if (d < SNAP && pinned()) connect();
    else if (d < 70 && !pinned()) pushAway();
  }
  requestAnimationFrame(frame);
}
layout();
frame();
