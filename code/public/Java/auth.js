// REGISTER: đăng ký tài khoản
async function register() {
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-password-confirm").value;
  const acceptPolicy = document.getElementById("accept-policy").checked;

  // VALIDATE thông tin
  if (username.length < 5) {
    alert("Username phải từ 5 ký tự trở lên");
    return;
  }
  if (!email) {
    alert("Email là bắt buộc");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Email không hợp lệ");
    return;
  }
  if (password.length < 6) {
    alert("Mật khẩu phải từ 6 ký tự trở lên");
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
  if (!acceptPolicy) {
    alert("Bạn phải đồng ý điều khoản người tiêu dùng");
    return;
  }

  // Gửi dữ liệu lên server
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // gửi cookie
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    // reset form
    document.getElementById("reg-username").value = "";
    document.getElementById("reg-email").value = "";
    document.getElementById("reg-password").value = "";
    document.getElementById("reg-password-confirm").value = "";
  }
}

// LOGIN: đăng nhập
async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
    return;
  }

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Đăng nhập thất bại");
    return;
  }

  alert("Đăng nhập thành công");
  location.href = "/index.html";
}

// LOGOUT: đăng xuất
async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  location.reload();
}
