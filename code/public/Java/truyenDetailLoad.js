// Dùng chung cho: follow, bình luận, chương, phân quyền
window.truyenHienTai = null;

// Load 1 lần, các file khác dùng lại
window.currentUser = null;

/* =================================================
  LOAD CHI TIẾT TRUYỆN
  - Lấy ID từ URL
  - Load user
  - Load truyện
  - Lưu lịch sử đọc
  - Render thông tin + chương
================================================= */
async function loadChiTiet() {
  // Lấy id từ URL
  const params = new URLSearchParams(window.location.search);
  const truyenId = params.get("id");

  // Không có id thì dừng
  if (!truyenId) return alert("Thiếu ID truyện");

  /* ===== LOAD USER ĐANG ĐĂNG NHẬP ===== */
  try {
    const meRes = await fetch("/api/me", {
      credentials: "include", // gửi cookie login
    });

    if (meRes.ok) {
      window.currentUser = await meRes.json();
    }
  } catch {
    // Chưa đăng nhập
    window.currentUser = null;
  }

  /* ===== LOAD CHI TIẾT TRUYỆN ===== */
  const res = await fetch(`/api/truyen/${truyenId}`);
  if (!res.ok) return alert("Không load được truyện");

  const truyen = await res.json();

  // Lưu global để file khác dùng
  window.truyenHienTai = truyen;

  /* ===== LƯU LỊCH SỬ ĐỌC ===== */
  try {
    await fetch(`/api/history/${truyenId}`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Lỗi lưu lịch sử:", err);
  }

  /* ===== HIỂN THỊ THÔNG TIN TRUYỆN ===== */
  document.getElementById("cover").src = truyen.anhBia || "/img/default.jpg";

  document.getElementById("title").textContent = truyen.tenTruyen;

  document.getElementById("author").textContent = "Tác giả: " + truyen.tacGia;

  document.getElementById("genre").textContent =
    "Thể loại: " + (truyen.theLoai?.join(", ") || "");

  document.getElementById("desc").textContent = truyen.moTa || "";

  // Render danh sách chương
  renderChuong(truyen.chuong || [], truyen._id);
}

//Kiểm tra quyền
//Hiện nút sửa / xoá nếu có quyền
function renderChuong(dsChuong, truyenId) {
  const box = document.getElementById("chuongList");
  box.innerHTML = ""; // reset

  // Không có chương
  if (!dsChuong.length) {
    box.innerHTML = "<p>Truyện chưa có chương</p>";
    return;
  }

  // User hiện tại
  const user = window.currentUser;

  // Admin (capBac = 2)
  const isAdmin = user && user.capBac === 2;

  // Chủ truyện (ID user === tacGiaId)
  const isOwner =
    user &&
    window.truyenHienTai &&
    String(window.truyenHienTai.tacGiaId) === String(user._id);

  // Có quyền sửa/xoá
  const coQuyen = isAdmin || isOwner;

  // Sắp xếp chương tăng dần
  dsChuong
    .sort((a, b) => a.soChuong - b.soChuong)
    .forEach((c) => {
      const div = document.createElement("div");
      div.className = "chuong-item";

      // HTML mỗi chương
      div.innerHTML = `
        <span>
          <b>Chương ${c.soChuong}:</b> ${c.tieuDe}
        </span>

        ${
          coQuyen
            ? `
          <span class="chuong-tools">
            <!-- Sửa chương -->
            <button onclick="chonSuaChuong(${c.soChuong}); event.stopPropagation()">✏️</button>

            <!-- Xoá chương -->
            <button onclick="xoaChuong(${c.soChuong}); event.stopPropagation()">🗑️</button>
          </span>
        `
            : ""
        }
      `;

      // Click mở trang đọc chương
      div.onclick = () => {
        location.href = `/Html/chuong.html?truyen=${truyenId}&chuong=${c.soChuong}`;
      };

      box.appendChild(div);
    });
}

//KHỞI ĐỘNG KHI LOAD TRANG
document.addEventListener("DOMContentLoaded", loadChiTiet);
