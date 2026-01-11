//BIẾN TOÀN CỤC
// Nút theo dõi
let btnFollow = null;

// Trạng thái đã theo dõi hay chưa
let isFollowed = false;

// Cache user hiện tại (tránh gọi API nhiều lần)
let currentUser = null;

//LOAD THÔNG TIN USER HIỆN TẠI
async function loadMe() {
  try {
    const res = await fetch("/api/me", {
      credentials: "include",
    });

    // Chưa đăng nhập
    if (!res.ok) return null;

    // Đã đăng nhập
    currentUser = await res.json();
    return currentUser;
  } catch (err) {
    return null;
  }
}

//KIỂM TRA TRẠNG THÁI THEO DÕI
function checkFollowStatus() {
  // Chưa đăng nhập hoặc chưa có danh sách theo dõi
  if (!currentUser || !currentUser.following) {
    isFollowed = false;
  }
  // Đã đăng nhập → kiểm tra truyện có trong following không
  else {
    isFollowed = currentUser.following.includes(truyenHienTai._id);
  }

  updateFollowUI();
}

//CLICK NÚT THEO DÕI / HUỶ THEO DÕI
async function handleFollowClick() {
  // Chưa đăng nhập
  if (!currentUser || !currentUser.username) {
    alert("Đăng nhập để theo dõi");
    return;
  }

  // Gửi yêu cầu toggle follow
  const res = await fetch(`/api/follow/${truyenHienTai._id}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Lỗi theo dõi");
    return;
  }

  // Backend trả về trạng thái mới
  isFollowed = data.followed;

  /* ===== CẬP NHẬT CACHE LOCAL ===== */
  if (data.followed) {
    // thêm truyện vào danh sách theo dõi
    currentUser.following.push(truyenHienTai._id);
  } else {
    // xoá truyện khỏi danh sách theo dõi
    currentUser.following = currentUser.following.filter(
      (id) => id !== truyenHienTai._id
    );
  }

  updateFollowUI();
}

//CẬP NHẬT GIAO DIỆN NÚT THEO DÕI
function updateFollowUI() {
  if (!btnFollow) return;

  if (isFollowed) {
    btnFollow.textContent = "✅ Đã theo dõi";
    btnFollow.classList.add("followed");
  } else {
    btnFollow.textContent = "⭐ Theo dõi";
    btnFollow.classList.remove("followed");
  }
}

//KHỞI ĐỘNG
document.addEventListener("DOMContentLoaded", async () => {
  // Lấy nút theo dõi
  btnFollow = document.getElementById("btnFollow");
  if (!btnFollow) return;

  // Gán sự kiện click
  btnFollow.addEventListener("click", handleFollowClick);

  // Chờ truyện load xong (truyenHienTai)
  const wait = setInterval(async () => {
    if (window.truyenHienTai?._id) {
      await loadMe(); // load user
      checkFollowStatus(); // kiểm tra đã theo dõi chưa
      clearInterval(wait);
    }
  }, 100);
});
