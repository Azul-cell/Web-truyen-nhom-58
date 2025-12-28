let currentUser = null;

/* ================= LOAD PROFILE ================= */
async function loadProfile() {
  const res = await fetch("/api/me", { credentials: "include" });

  if (!res.ok) {
    alert("Chưa đăng nhập hoặc tài khoản bị khoá");
    location.href = "/login.html";
    return;
  }

  currentUser = await res.json();

  // HEADER
  document.getElementById("profileUsername").textContent = currentUser.username;
  document.getElementById("user-name").textContent = currentUser.username;
  document.getElementById("email").textContent =
    currentUser.email ?? "Chưa có email";

  const roleMap = ["👤 User", "✍️ Tác giả", "👑 Admin"];
  document.getElementById("role").textContent =
    roleMap[currentUser.capBac] || "Không rõ";

  // TAB QUYỀN
  if (currentUser.capBac >= 1) {
    document.getElementById("tab-author").style.display = "inline-block";
  }

  if (currentUser.capBac === 2) {
    document.getElementById("tab-admin").style.display = "inline-block";
  }

  openTab("user");
}

/* ================= TAB ================= */
function openTab(name) {
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));

  document
    .querySelectorAll(".tabs button")
    .forEach((b) => b.classList.remove("active"));

  document.getElementById(name).classList.add("active");
  document.querySelector(`[data-tab="${name}"]`).classList.add("active");

  if (name === "author") loadTruyen();
  if (name === "admin") loadUsers();
}

/* ================= TRUYỆN ================= */
async function loadTruyen() {
  const res = await fetch("/api/truyen", { credentials: "include" });
  if (!res.ok) return;

  const ds = await res.json();
  const box = document.getElementById("author");
  box.innerHTML = "<h3>📚 Truyện đã đăng</h3>";

  const list =
    currentUser.capBac === 2
      ? ds
      : ds.filter((t) => t.tacGiaId === currentUser._id);

  if (!list.length) {
    box.innerHTML += "<p>Chưa có truyện</p>";
    return;
  }

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

/* ================= XOÁ TRUYỆN ================= */
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

  loadTruyen();
}

/* ================= ADMIN ================= */
async function loadUsers() {
  const res = await fetch("/api/admin/users", {
    credentials: "include",
  });

  if (!res.ok) return;

  const users = await res.json();
  const box = document.getElementById("admin");
  box.innerHTML = "<h3>🛠 Quản lý user</h3>";

  users.forEach((u) => {
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

/* ================= BAN / UNBAN ================= */
async function toggleBan(id) {
  if (!confirm("Thực hiện hành động này?")) return;

  await fetch(`/api/admin/ban/${id}`, {
    method: "POST",
    credentials: "include",
  });

  loadUsers();
}

/* ================= EVENTS ================= */
document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.onclick = () => openTab(btn.dataset.tab);
});

document.addEventListener("DOMContentLoaded", loadProfile);
