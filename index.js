const screen = document.getElementById("screen");
const errorModal = document.getElementById("errorModal");
const closeBtn = document.querySelector(".close");
const errorMessage = document.getElementById("errorMessage");
const colorMenu = document.getElementById("colorMenu");
const settingsBtn = document.getElementById("settingsBtn");

let input = "";

// Danh sách ngày sinh được cài đặt
const validBirthdays = ["13122005", "22102005", "28072005", "09072005"];

// Danh sách ngày sinh đã có trang riêng
const availablePages = ["13122005", "09072005"];

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

    // Cập nhật active state
    document
      .querySelectorAll(".color-option")
      .forEach((opt) => opt.classList.remove("active"));
    option.classList.add("active");

    // Áp dụng theme
    applyTheme(themeIndex);

    // Đóng menu
    colorMenu.style.display = "none";
  });
});

// Áp dụng theme
function applyTheme(index) {
  const theme = themes[index];
  document.body.style.background = theme.bg;
  document.documentElement.style.setProperty("--btn-color-1", theme.btn1);
  document.documentElement.style.setProperty("--btn-color-2", theme.btn2);
}

// Khởi tạo theme mặc định
applyTheme(0);

// Xử lý nhập số
document.querySelectorAll(".btn[data-num]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (input.length < 8) {
      input += btn.dataset.num;
      updateScreen();

      // Hiệu ứng click
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

  // Kiểm tra ngày sinh có trong danh sách không
  if (!validBirthdays.includes(input)) {
    showError("Hưng Đinh không biết người này! 🤔");
    return;
  }

  // Kiểm tra có trang riêng chưa
  if (!availablePages.includes(input)) {
    // Chưa có trang riêng, chuyển sang trang "chưa đến"
    window.location.href = "pages/chuaco.html";
    return;
  }

  // Nếu có trang riêng thì chuyển trang
  const dd = input.slice(0, 2);
  const mm = input.slice(2, 4);
  const yyyy = input.slice(4);

  const filename = `dd_mm_yyyy_${dd}${mm}${yyyy}.html`;
  window.location.href = `pages/${filename}`;
};

// Hiển thị modal lỗi
function showError(message) {
  errorMessage.innerHTML = message;
  errorModal.style.display = "block";
}

// Đóng modal
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
