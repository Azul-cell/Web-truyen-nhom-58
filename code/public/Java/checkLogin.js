document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/me", {
      credentials: "same-origin",
    });

    const user = await res.json();

    // ❌ chưa đăng nhập
    if (!user) {
      document.getElementById("loginBtn").style.display = "inline-block";
      document.getElementById("userBox").style.display = "none";
      return;
    }

    // ✅ đã đăng nhập
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("userBox").style.display = "flex";
    document.getElementById("username").innerText = user.username;
  } catch (err) {
    console.error("Check login error:", err);
  }
});

fetch("/api/me")
  .then((res) => res.json())
  .then((user) => {
    const loginBtn = document.getElementById("loginBtn");
    const userBox = document.getElementById("userBox");
    const usernameSpan = document.getElementById("username");

    if (!user) {
      loginBtn.style.display = "inline-block";
      userBox.style.display = "none";
      return;
    }

    loginBtn.style.display = "none";
    userBox.style.display = "flex";
    usernameSpan.textContent = user.username;

    // 👑 ADMIN
    // 👉 Nếu là admin → hiện menu quản trị
    if (user.role === "admin") {
      document.getElementById("adminMenu").style.display = "inline-block";
    }
  });
