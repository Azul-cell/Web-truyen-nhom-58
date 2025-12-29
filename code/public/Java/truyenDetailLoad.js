// 🌐 TRUYỆN ĐANG XEM
window.truyenHienTai = null;

// 🌐 USER ĐANG ĐĂNG NHẬP
window.currentUser = null;

/* =================================================
   LOAD CHI TIẾT TRUYỆN
================================================= */
async function loadChiTiet() {
  const params = new URLSearchParams(window.location.search);
  const truyenId = params.get("id");

  if (!truyenId) {
    alert("Không có ID truyện");
    return;
  }

  try {
    /* ================= LOAD USER ================= */
    try {
      const meRes = await fetch("/api/me", { credentials: "include" });
      if (meRes.ok) {
        window.currentUser = await meRes.json();
      }
    } catch {
      window.currentUser = null;
    }

    /* ================= LOAD TRUYỆN ================= */
    const res = await fetch(`/api/truyen/${truyenId}`);
    if (!res.ok) throw new Error("Không load được truyện");

    const truyen = await res.json();
    window.truyenHienTai = truyen;

    /* ================= HIỂN THỊ ================= */
    document.getElementById("cover").src = truyen.anhBia || "/img/default.jpg";

    document.getElementById("title").textContent = truyen.tenTruyen;
    document.getElementById("author").textContent =
      "Tác giả: " + (truyen.tacGia || "Đang cập nhật");

    document.getElementById("genre").textContent =
      "Thể loại: " + (truyen.theLoai?.join(", ") || "Khác");

    document.getElementById("desc").textContent =
      truyen.moTa || "Chưa có mô tả";

    /* ================= DANH SÁCH CHƯƠNG ================= */
    renderChuong(truyen.chuong || [], truyen._id);
  } catch (err) {
    console.error(err);
    alert("Lỗi load chi tiết truyện");
  }
}

/* =================================================
   RENDER DANH SÁCH CHƯƠNG (DUY NHẤT 1 BẢN)
================================================= */
function renderChuong(dsChuong, truyenId) {
  const box = document.getElementById("chuongList");
  if (!box || !truyenId) return;

  box.innerHTML = "";

  if (!dsChuong.length) {
    box.innerHTML = "<p>Truyện chưa có chương</p>";
    return;
  }

  const user = window.currentUser;
  const isAdmin = user && user.capBac === 2;
  const isOwner =
    user &&
    window.truyenHienTai &&
    user.userId === window.truyenHienTai.tacGiaId;

  const coQuyen = isAdmin || isOwner;

  dsChuong
    .sort((a, b) => a.soChuong - b.soChuong)
    .forEach((c) => {
      const div = document.createElement("div");
      div.className = "chuong-item";

      div.innerHTML = `
        <span>
          <b>Chương ${c.soChuong}:</b> ${c.tieuDe}
        </span>

        ${
          coQuyen
            ? `
          <span class="chuong-tools">
            <button onclick="chonSuaChuong(${c.soChuong}); event.stopPropagation()">✏️</button>
            <button onclick="xoaChuong(${c.soChuong}); event.stopPropagation()">🗑</button>
          </span>
        `
            : ""
        }
      `;

      // 👉 CLICK ĐỌC CHƯƠNG
      div.onclick = () => {
        location.href = `/Html/chuong.html?truyen=${truyenId}&chuong=${c.soChuong}`;
      };

      box.appendChild(div);
    });
}

/* =================================================
   START
================================================= */
document.addEventListener("DOMContentLoaded", loadChiTiet);
