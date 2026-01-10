let btnFollow = null;
let isFollowed = false;
let currentUser = null; // ✅ cache user

/* ================= LOAD USER ================= */
async function loadMe() {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    if (!res.ok) return null;
    currentUser = await res.json();
    return currentUser;
  } catch {
    return null;
  }
}

/* ================= CHECK TRẠNG THÁI ================= */
function checkFollowStatus() {
  if (!currentUser || !currentUser.following) {
    isFollowed = false;
  } else {
    isFollowed = currentUser.following.includes(truyenHienTai._id);
  }
  updateFollowUI();
}

/* ================= CLICK ================= */
async function handleFollowClick() {
  if (!currentUser || !currentUser.username) {
    alert("Đăng nhập để theo dõi");
    return;
  }

  const res = await fetch(`/api/follow/${truyenHienTai._id}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message || "Lỗi theo dõi");

  isFollowed = data.followed;

  // ✅ cập nhật cache local
  if (data.followed) {
    currentUser.following.push(truyenHienTai._id);
  } else {
    currentUser.following = currentUser.following.filter(
      (id) => id !== truyenHienTai._id
    );
  }

  updateFollowUI();
}

/* ================= UI ================= */
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

/* ================= KHỞI ĐỘNG ================= */
document.addEventListener("DOMContentLoaded", async () => {
  btnFollow = document.getElementById("btnFollow");
  if (!btnFollow) return;

  btnFollow.addEventListener("click", handleFollowClick);

  //  chờ truyện load
  const wait = setInterval(async () => {
    if (window.truyenHienTai?._id) {
      await loadMe();
      checkFollowStatus();
      clearInterval(wait);
    }
  }, 100);
});
