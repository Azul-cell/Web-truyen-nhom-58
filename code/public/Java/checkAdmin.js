// Chờ toàn bộ HTML load xong rồi mới chạy JS
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Gửi request lấy thông tin user hiện tại
    const res = await fetch("/api/me", {
      credentials: "same-origin", // gửi cookie để xác thực đăng nhập
    });

    // Nếu chưa đăng nhập hoặc token không hợp lệ
    if (!res.ok) {
      // Chuyển về trang đăng nhập
      location.href = "/Html/dangNhap.html";
      return;
    }

    // Lấy dữ liệu user từ server
    const user = await res.json();

    // Kiểm tra cấp bậc người dùng
    // capBac < 1 không đủ quyền
    if (!user || user.capBac < 1) {
      alert("Bạn không có quyền truy cập trang này");

      // Quay về trang chủ
      location.href = "/";
    }
  } catch (err) {
    // Đưa người dùng về trang chủ
    location.href = "/";
  }
});
