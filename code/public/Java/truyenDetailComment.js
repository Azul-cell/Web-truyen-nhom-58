const binhLuanList = document.getElementById("binhLuanList");
const inputNoiDung = document.getElementById("noiDungBinhLuan");
const btnGui = document.getElementById("btnGuiBinhLuan");

window.currentUser = window.currentUser || null;

/* ================= KIỂM TRA ĐĂNG NHẬP ================= */
async function checkLoginForComment() {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    currentUser = await res.json();

    if (!currentUser || !currentUser.username) {
      inputNoiDung.disabled = true;
      btnGui.disabled = true;
      inputNoiDung.placeholder = "Đăng nhập để bình luận";
    } else {
      inputNoiDung.disabled = false;
      btnGui.disabled = false;
      inputNoiDung.placeholder = "Viết bình luận...";
    }
  } catch (err) {
    console.error(err);
  }
}

/* ================= LOAD BÌNH LUẬN ================= */
async function loadBinhLuan() {
  if (!window.truyenHienTai?._id) return;

  try {
    const res = await fetch(`/api/binhluan/${truyenHienTai._id}`);
    if (!res.ok) throw new Error("Không load được bình luận");

    const ds = await res.json();
    binhLuanList.innerHTML = "";

    if (!ds || ds.length === 0) {
      binhLuanList.innerHTML = "<p>Chưa có bình luận</p>";
      return;
    }

    ds.forEach((bl) => {
      const div = document.createElement("div");
      div.className = "binhluan-item";

      const ten = bl.username || "Người dùng";

      /* ===== CHUYỂN capBac → TEXT ===== */
      let capBacText = "👤 Độc giả";
      if (bl.capBac === 1) capBacText = "✍️ Tác giả";
      if (bl.capBac === 2) capBacText = "👑 Admin";

      /* ===== KIỂM TRA QUYỀN XOÁ ===== */
      const coQuyenXoa =
        currentUser &&
        (currentUser._id === bl.userId || currentUser.capBac >= 2);

      /* ===== RENDER HTML ===== */
      div.innerHTML = `
        <div class="bl-header">
          <span class="bl-user">
            ${ten}
            <span class="bl-role">${capBacText}</span>
          </span>
          <span class="bl-time">
            ${new Date(bl.createdAt).toLocaleString()}
          </span>
          ${
            coQuyenXoa
              ? `<button class="bl-delete" title="Xoá bình luận">🗑️</button>`
              : ""
          }
        </div>
        <div class="bl-content">${bl.noiDung}</div>
      `;

      /* ===== SỰ KIỆN XOÁ ===== */
      if (coQuyenXoa) {
        div.querySelector(".bl-delete").onclick = () => xoaBinhLuan(bl._id);
      }

      binhLuanList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

/* ================= GỬI BÌNH LUẬN ================= */
btnGui.onclick = async () => {
  const noiDung = inputNoiDung.value.trim();
  if (!noiDung) return alert("Nhập nội dung bình luận");

  if (!window.truyenHienTai?._id) {
    return alert("Chưa load truyện");
  }

  try {
    const res = await fetch(`/api/binhluan/${truyenHienTai._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ noiDung }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Gửi thất bại");

    inputNoiDung.value = "";
    loadBinhLuan();
  } catch (err) {
    console.error(err);
    alert("Lỗi gửi bình luận");
  }
};

/* ================= XOÁ BÌNH LUẬN ================= */
async function xoaBinhLuan(binhLuanId) {
  if (!confirm("Bạn chắc chắn muốn xoá bình luận này?")) return;

  try {
    const res = await fetch(
      `/api/binhluan/${truyenHienTai._id}/${binhLuanId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Xoá thất bại");

    loadBinhLuan();
  } catch (err) {
    console.error(err);
    alert("Lỗi xoá bình luận");
  }
}

/* ================= KHỞI ĐỘNG ================= */
document.addEventListener("DOMContentLoaded", async () => {
  await checkLoginForComment();

  const timer = setInterval(() => {
    if (window.truyenHienTai?._id) {
      loadBinhLuan();
      clearInterval(timer);
    }
  }, 100);
});
