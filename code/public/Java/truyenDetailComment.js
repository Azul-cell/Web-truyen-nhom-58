//DOM ELEMENT

// Danh sách bình luận
const binhLuanList = document.getElementById("binhLuanList");

// Input nhập nội dung bình luận
const inputNoiDung = document.getElementById("noiDungBinhLuan");

// Nút gửi bình luận
const btnGui = document.getElementById("btnGuiBinhLuan");

// User hiện tại (dùng chung toàn trang)
window.currentUser = window.currentUser || null;

//KIỂM TRA ĐĂNG NHẬP ĐỂ BÌNH LUẬN
async function checkLoginForComment() {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    currentUser = await res.json();

    // Chưa đăng nhập
    if (!currentUser || !currentUser.username) {
      inputNoiDung.disabled = true;
      btnGui.disabled = true;
      inputNoiDung.placeholder = "Đăng nhập để bình luận";
    }
    // Đã đăng nhập
    else {
      inputNoiDung.disabled = false;
      btnGui.disabled = false;
      inputNoiDung.placeholder = "Viết bình luận...";
    }
  } catch (err) {
    console.error("Check login lỗi:", err);
  }
}

//LOAD DANH SÁCH BÌNH LUẬN
async function loadBinhLuan() {
  // Chưa load truyện → thoát
  if (!window.truyenHienTai?._id) return;

  try {
    const res = await fetch(`/api/binhluan/${truyenHienTai._id}`);
    if (!res.ok) throw new Error("Không load được bình luận");

    const ds = await res.json();
    binhLuanList.innerHTML = "";

    // Không có bình luận
    if (!ds || ds.length === 0) {
      binhLuanList.innerHTML = "<p>Chưa có bình luận</p>";
      return;
    }

    /* ===== RENDER TỪNG BÌNH LUẬN ===== */
    ds.forEach((bl) => {
      const div = document.createElement("div");
      div.className = "binhluan-item";

      const ten = bl.username || "Người dùng";

      /* ----- CHUYỂN capBac → CHỮ ----- */
      let capBacText = "👤 Độc giả";
      if (bl.capBac === 1) capBacText = "✍️ Tác giả";
      if (bl.capBac === 2) capBacText = "👑 Admin";

      /* ----- KIỂM TRA QUYỀN XOÁ ----- */
      // Chủ bình luận hoặc Admin
      const coQuyenXoa =
        currentUser &&
        (currentUser._id === bl.userId || currentUser.capBac >= 2);

      /* ----- HTML BÌNH LUẬN ----- */
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

      /* ----- SỰ KIỆN XOÁ ----- */
      if (coQuyenXoa) {
        div.querySelector(".bl-delete").onclick = () => xoaBinhLuan(bl._id);
      }

      binhLuanList.appendChild(div);
    });
  } catch (err) {
    console.error("Load bình luận lỗi:", err);
  }
}

//GỬI BÌNH LUẬN
btnGui.onclick = async () => {
  const noiDung = inputNoiDung.value.trim();

  if (!noiDung) {
    alert("Nhập nội dung bình luận");
    return;
  }

  if (!window.truyenHienTai?._id) {
    alert("Chưa load truyện");
    return;
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

    // Clear input + reload bình luận
    inputNoiDung.value = "";
    loadBinhLuan();
  } catch (err) {
    console.error("Gửi bình luận lỗi:", err);
    alert("Lỗi gửi bình luận");
  }
};

//XOÁ BÌNH LUẬN
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

    // Reload lại danh sách
    loadBinhLuan();
  } catch (err) {
    console.error("Xoá bình luận lỗi:", err);
    alert("Lỗi xoá bình luận");
  }
}

//KHỞI ĐỘNG
document.addEventListener("DOMContentLoaded", async () => {
  // Kiểm tra đăng nhập
  await checkLoginForComment();

  // Đợi truyenHienTai load
  const timer = setInterval(() => {
    if (window.truyenHienTai?._id) {
      loadBinhLuan();
      clearInterval(timer);
    }
  }, 100);
});
