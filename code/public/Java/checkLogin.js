// Chạy sau khi toàn bộ HTML đã load xong
document.addEventListener("DOMContentLoaded", async () => {
  // Lấy các phần tử trên giao diện
  const loginBtn = document.getElementById("loginBtn"); // nút Đăng nhập
  const userBox = document.getElementById("userBox"); // khung hiển thị user
  const usernameSpan = document.getElementById("username"); // nơi hiện tên user
  const adminMenu = document.getElementById("adminMenu"); // menu quản trị

  try {
    // Gọi API kiểm tra người dùng hiện tại
    const res = await fetch("/api/me", {
      credentials: "same-origin", // gửi cookie để xác thực
    });

    // Chưa đăng nhập hoặc token không hợp lệ
    if (!res.ok) {
      loginBtn.style.display = "inline-block"; // hiện nút đăng nhập
      userBox.style.display = "none"; // ẩn thông tin user
      adminMenu && (adminMenu.style.display = "none"); // ẩn menu admin
      return;
    }

    // Lấy dữ liệu user từ server
    const user = await res.json();

    // Không có user (dữ liệu lỗi)
    if (!user) {
      loginBtn.style.display = "inline-block";
      userBox.style.display = "none";
      adminMenu && (adminMenu.style.display = "none");
      return;
    }

    // Đã đăng nhập
    loginBtn.style.display = "none"; // ẩn nút đăng nhập
    userBox.style.display = "flex"; // hiện khung user
    usernameSpan.textContent = user.username; // hiển thị tên user

    // ===== PHÂN QUYỀN =====
    // 0 → độc giả
    // 1 → tác giả
    // 2 → admin
    if (user.capBac >= 1 && adminMenu) {
      // Tác giả hoặc admin → hiện menu quản trị
      adminMenu.style.display = "flex";
    } else if (adminMenu) {
      // Độc giả → ẩn menu quản trị
      adminMenu.style.display = "none";
    }
  } catch (err) {
    // Lỗi mạng / lỗi server
    console.error("Check login error:", err);

    // Trạng thái an toàn: coi như chưa đăng nhập
    loginBtn.style.display = "inline-block";
    userBox.style.display = "none";
    adminMenu && (adminMenu.style.display = "none");
  }
});
