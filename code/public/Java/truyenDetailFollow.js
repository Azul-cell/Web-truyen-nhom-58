let btnFollow = null;
let isFollowed = false;

/* ================= CHECK TRẠNG THÁI ================= */
async function checkFollowStatus() {
  const res = await fetch("/api/me", { credentials: "include" });
  const user = await res.json();

  if (!user || !user.following) {
    isFollowed = false;
    updateFollowUI();
    return;
  }

  isFollowed = user.following.includes(truyenHienTai._id);
  updateFollowUI();
}

/* ================= CLICK ================= */
async function handleFollowClick() {
  const resMe = await fetch("/api/me", { credentials: "include" });
  const user = await resMe.json();

  if (!user || !user.username) {
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
document.addEventListener("DOMContentLoaded", () => {
  // 🔥 LẤY DOM Ở ĐÂY – KHÔNG ĐƯỢC LẤY Ở ĐẦU FILE
  btnFollow = document.getElementById("btnFollow");
  if (!btnFollow) return;

  btnFollow.addEventListener("click", handleFollowClick);

  const wait = setInterval(() => {
    if (window.truyenHienTai?._id) {
      checkFollowStatus();
      clearInterval(wait);
    }
  }, 100);
});
