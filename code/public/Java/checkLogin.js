document.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("loginBtn");
  const userBox = document.getElementById("userBox");
  const usernameSpan = document.getElementById("username");
  const adminMenu = document.getElementById("adminMenu");

  try {
    const res = await fetch("/api/me", {
      credentials: "same-origin",
    });

    // chưa đăng nhập
    if (!res.ok) {
      loginBtn.style.display = "inline-block";
      userBox.style.display = "none";
      adminMenu && (adminMenu.style.display = "none");
      return;
    }

    const user = await res.json();
    if (!user) {
      loginBtn.style.display = "inline-block";
      userBox.style.display = "none";
      adminMenu && (adminMenu.style.display = "none");
      return;
    }

    // đã đăng nhập
    loginBtn.style.display = "none";
    userBox.style.display = "flex";
    usernameSpan.textContent = user.username;

    // QUYỀN QUẢN TRỊ / TÁC GIẢ
    // 0 = độc giả
    // 1 = tác giả
    // 2 = admin
    if (user.capBac >= 1 && adminMenu) {
      adminMenu.style.display = "flex";
    } else if (adminMenu) {
      adminMenu.style.display = "none";
    }
  } catch (err) {
    console.error("Check login error:", err);
    loginBtn.style.display = "inline-block";
    userBox.style.display = "none";
    adminMenu && (adminMenu.style.display = "none");
  }
});
