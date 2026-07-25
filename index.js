const screen = document.getElementById("screen");
const errorModal = document.getElementById("errorModal");
const closeBtn = document.querySelector(".close");
const errorMessage = document.getElementById("errorMessage");
const colorMenu = document.getElementById("colorMenu");
const settingsBtn = document.getElementById("settingsBtn");

let input = "";

// ⚠️ danh sách ngày sinh được phép nhập (định dạng ddmmyyyy)
const validBirthdays = ["13122005", "22102005", "28072005", "09072005"];

// ⚠️ những ngày sinh đã có trang chúc mừng riêng
// target = trang chúc mừng chính
// loading = tên file loading dùng riêng cho người này (để null nếu không muốn troll, đi thẳng vào target luôn)
const availablePages = {
  28072005: {
    target: "dd_mm_yyyy_28072005.html",
    loading: "loading.html",
  },
  13122005: {
    target: "dd_mm_yyyy_13122005.html",
    loading: null, // ví dụ: đứa này không troll, vào thẳng luôn
  },
  "09072005": {
    target: "dd_mm_yyyy_09072005.html",
    loading: null, // ví dụ: đứa này sau làm 1 kiểu loading khác
  },
};

// Danh sách theme màu
const themes = [
  {
    bg: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    btn1: "#b8a4f5",
    btn2: "#7ba8ea",
  },
  {
    bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    btn1: "#ffd9a8",
    btn2: "#fa9e7d",
  },
  {
    bg: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    btn1: "#7fb0fb",
    btn2: "#a0ddf9",
  },
  {
    bg: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
    btn1: "#ffd97d",
    btn2: "#f9b84c",
  },
  {
    bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    btn1: "#f84e7e",
    btn2: "#fdd11e",
  },
  {
    bg: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
    btn1: "#c77dae",
    btn2: "#fcefb5",
  },
  {
    bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    btn1: "#86dfd8",
    btn2: "#fcbacf",
  },
  {
    bg: "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)",
    btn1: "#b5c4cd",
    btn2: "#ccd9e1",
  },
  {
    bg: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    btn1: "#f9a4d9",
    btn2: "#8daee6",
  },
];

let currentTheme = 0;

// Toggle menu màu
settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  colorMenu.style.display =
    colorMenu.style.display === "block" ? "none" : "block";
});

// Đóng menu khi click ra ngoài
document.addEventListener("click", (e) => {
  if (!colorMenu.contains(e.target) && e.target !== settingsBtn) {
    colorMenu.style.display = "none";
  }
});

// Chọn màu theme
document.querySelectorAll(".color-option").forEach((option) => {
  option.addEventListener("click", () => {
    const themeIndex = parseInt(option.dataset.theme);
    currentTheme = themeIndex;

    document
      .querySelectorAll(".color-option")
      .forEach((opt) => opt.classList.remove("active"));
    option.classList.add("active");

    applyTheme(themeIndex);
    colorMenu.style.display = "none";
  });
});

function applyTheme(index) {
  const theme = themes[index];
  document.body.style.background = theme.bg;
  document.documentElement.style.setProperty("--btn-color-1", theme.btn1);
  document.documentElement.style.setProperty("--btn-color-2", theme.btn2);
}

applyTheme(0);

// Xử lý nhập số
document.querySelectorAll(".btn[data-num]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (input.length < 8) {
      input += btn.dataset.num;
      updateScreen();

      btn.style.transform = "scale(0.95)";
      setTimeout(() => {
        btn.style.transform = "";
      }, 100);
    }
  });
});

// Nút xóa
document.getElementById("clear").onclick = () => {
  input = "";
  updateScreen();
};

// Cập nhật màn hình
function updateScreen() {
  if (input.length === 0) {
    screen.innerHTML =
      '<span class="placeholder"> Có mỗi cái ngày sinh mà nhập đi nhập lại còn không xong nữa :>> </span>';
  } else if (input.length <= 2) {
    screen.textContent = input;
  } else if (input.length <= 4) {
    screen.textContent = input.slice(0, 2) + "/" + input.slice(2);
  } else {
    screen.textContent =
      input.slice(0, 2) + "/" + input.slice(2, 4) + "/" + input.slice(4);
  }
}

// Nút OK
document.getElementById("enter").onclick = () => {
  if (input.length !== 8) {
    showError("Ngày-tháng đủ 2 số, Năm phải 4 số nha bà! 😊");
    return;
  }

  if (!validBirthdays.includes(input)) {
    showError("Hưng Đinh không biết người này! 🤔");
    return;
  }

  const entry = availablePages[input];

  if (!entry) {
    // Có trong validBirthdays nhưng chưa làm trang riêng
    window.location.href = "pages/chuaco.html";
    return;
  }

  if (entry.loading) {
    // Đi qua màn loading troll riêng của người này trước
    window.location.href = `pages/${entry.loading}?target=${encodeURIComponent(
      entry.target,
    )}`;
  } else {
    // Không troll, vào thẳng trang chúc mừng
    window.location.href = `pages/${entry.target}`;
  }
};

// Hiển thị modal lỗi
function showError(message) {
  errorMessage.innerHTML = message;
  errorModal.style.display = "block";
}

closeBtn.onclick = () => {
  errorModal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == errorModal) {
    errorModal.style.display = "none";
  }
};

// Cho phép nhập từ bàn phím
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9" && input.length < 8) {
    input += e.key;
    updateScreen();
  } else if (e.key === "Backspace") {
    input = input.slice(0, -1);
    updateScreen();
  } else if (e.key === "Enter") {
    document.getElementById("enter").click();
  } else if (e.key === "Escape") {
    input = "";
    updateScreen();
  }
});
