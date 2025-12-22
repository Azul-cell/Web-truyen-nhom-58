/* ===== REGISTER ===== */
async function register() {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-password-confirm").value;

  if (username.length < 5) {
    alert("Tài khoản phải từ 5 ký tự trở lên");
    return;
  }

  if (password.length < 6) {
    alert("Mật khẩu phải trên 6 ký tự");
    return;
  }

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    alert("Mật khẩu phải chứa cả chữ và số");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu nhập lại không khớp");
    return;
  }

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  alert(data.message);
}

/* ===== LOGIN ===== */
async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin", // 🔥 QUAN TRỌNG
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) location.href = "/";
}

/* ===== LOGOUT ===== */
function logout() {
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  }).then(() => {
    location.reload();
  });
}
