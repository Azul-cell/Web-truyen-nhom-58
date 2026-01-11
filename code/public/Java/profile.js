// Lưu thông tin user hiện tại sau khi load
let currentUser = null;

// ================= LOAD THÔNG TIN PROFILE =================
async function loadProfile() {
  // Gọi API lấy thông tin user đang đăng nhập
  const res = await fetch("/api/me", { credentials: "include" });

  // Chưa đăng nhập hoặc tài khoản bị khoá
  if (!res.ok) {
    alert("Chưa đăng nhập hoặc tài khoản bị khoá");
    location.href = "/login.html";
    return;
  }

  // Lưu user vào biến global
  currentUser = await res.json();

  // Hiển thị thông tin trên header
  document.getElementById("profileUsername").textContent = currentUser.username;
  document.getElementById("user-name").textContent = currentUser.username;
  document.getElementById("email").textContent =
    currentUser.email ?? "Chưa có email";

  // Map cấp bậc sang tên hiển thị
  const roleMap = ["👤 User", "✍️ Tác giả", "👑 Admin"];
  document.getElementById("role").textContent =
    roleMap[currentUser.capBac] || "Không rõ";

  // Hiện tab tác giả nếu có quyền
  if (currentUser.capBac >= 1) {
    document.getElementById("tab-author").style.display = "inline-block";
  }

  // Hiện tab admin nếu là admin
  if (currentUser.capBac === 2) {
    document.getElementById("tab-admin").style.display = "inline-block";
  }

  // Mở tab user mặc định
  openTab("user");
}

// ================= ĐIỀU KHIỂN TAB =================
function openTab(name) {
  // Ẩn toàn bộ nội dung tab
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));

  // Bỏ active tất cả nút tab
  document
    .querySelectorAll(".tabs button")
    .forEach((b) => b.classList.remove("active"));

  // Hiện tab được chọn
  document.getElementById(name).classList.add("active");
  document.querySelector(`[data-tab="${name}"]`).classList.add("active");

  // Load dữ liệu tương ứng với từng tab
  if (name === "author") loadTruyen();
  if (name === "admin") loadUsers();
}

// ================= LOAD TRUYỆN ĐÃ ĐĂNG =================
async function loadTruyen() {
  const res = await fetch("/api/truyen", { credentials: "include" });
  if (!res.ok) return;

  const ds = await res.json();
  const box = document.getElementById("author");
  box.innerHTML = "<h3>📚 Truyện đã đăng</h3>";

  // Admin thấy tất cả, tác giả chỉ thấy truyện của mình
  const list =
    currentUser.capBac === 2
      ? ds
      : ds.filter((t) => t.tacGiaId === currentUser._id);

  if (!list.length) {
    box.innerHTML += "<p>Chưa có truyện</p>";
    return;
  }

  // Render danh sách truyện
  list.forEach((t) => {
    const isOwner = t.tacGiaId === currentUser._id;
    const isAdmin = currentUser.capBac === 2;

    box.innerHTML += `
      <div class="card">
        <div class="card-left">
          <b>${t.tenTruyen}</b>
          <small>✍️ ${t.tacGia}</small>
        </div>

        ${
          isAdmin || isOwner
            ? `<button onclick="xoaTruyen('${t._id}')">🗑 Xoá</button>`
            : ""
        }
      </div>
    `;
  });
}

// ================= XOÁ TRUYỆN =================
async function xoaTruyen(id) {
  if (!confirm("Xoá truyện này?")) return;

  const res = await fetch(`/api/admin/truyen/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    alert("Không có quyền");
    return;
  }

  // Load lại danh sách sau khi xoá
  loadTruyen();
}

// ================= QUẢN LÝ USER (ADMIN) =================
async function loadUsers() {
  const res = await fetch("/api/admin/users", {
    credentials: "include",
  });

  if (!res.ok) return;

  const users = await res.json();
  const box = document.getElementById("admin");
  box.innerHTML = "<h3>🛠 Quản lý user</h3>";

  users.forEach((u) => {
    // Không cho admin tự quản admin khác
    if (u.capBac === 2) return;

    const role = u.capBac === 1 ? "✍️ Tác giả" : "👤 User";

    box.innerHTML += `
      <div class="card">
        <div class="card-left">
          <b>${u.username}</b>
          <span>${role}</span>
          ${u.banned ? "<small>🚫 Đã ban</small>" : ""}
        </div>

        <button onclick="toggleBan('${u._id}')">
          ${u.banned ? "✅ Unban" : "🚫 Ban"}
        </button>
      </div>
    `;
  });
}

// ================= BAN / UNBAN USER =================
async function toggleBan(id) {
  if (!confirm("Thực hiện hành động này?")) return;

  await fetch(`/api/admin/ban/${id}`, {
    method: "POST",
    credentials: "include",
  });

  // Load lại danh sách user
  loadUsers();
}

// ================= SỰ KIỆN =================
document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.onclick = () => openTab(btn.dataset.tab);
});

// Load profile khi mở trang
document.addEventListener("DOMContentLoaded", loadProfile);
