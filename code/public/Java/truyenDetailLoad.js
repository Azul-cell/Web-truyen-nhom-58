// 🌐 TRUYỆN ĐANG XEM
window.truyenHienTai = null;

// 🌐 USER ĐANG ĐĂNG NHẬP
window.currentUser = null;

/* =================================================
   LOAD CHI TIẾT TRUYỆN
================================================= */
async function loadChiTiet() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Không có ID truyện");
    return;
  }

  try {
    /* =================================================
       🔐 LOAD USER
    ================================================= */
    try {
      const meRes = await fetch("/api/me", { credentials: "include" });
      if (meRes.ok) {
        window.currentUser = await meRes.json();
      }
    } catch {
      window.currentUser = null;
    }

    /* =================================================
       📡 LOAD TRUYỆN
    ================================================= */
    const res = await fetch(`/api/truyen/${id}`);
    if (!res.ok) throw new Error("Không load được truyện");

    const truyen = await res.json();
    window.truyenHienTai = truyen;

    /* =================================================
       HIỂN THỊ TRUYỆN
    ================================================= */
    document.getElementById("cover").src = truyen.anhBia || "/img/default.jpg";

    document.getElementById("title").textContent = truyen.tenTruyen;

    document.getElementById("author").textContent =
      "Tác giả: " + (truyen.tacGia || "Đang cập nhật");

    document.getElementById("genre").textContent =
      "Thể loại: " + (truyen.theLoai?.join(", ") || "Khác");

    document.getElementById("desc").textContent =
      truyen.moTa || "Chưa có mô tả";

    /* =================================================
       DANH SÁCH CHƯƠNG
    ================================================= */
    renderChuong(truyen.chuong || []);

    /* =================================================
       LOAD BÌNH LUẬN
    ================================================= */
    if (typeof loadBinhLuan === "function") {
      loadBinhLuan();
    }

    /* =================================================
       LƯU LỊCH SỬ ĐỌC
    ================================================= */
    fetch(`/api/history/${truyen._id}`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error(err);
    alert("Lỗi load chi tiết truyện");
  }
}

/* =================================================
   RENDER CHƯƠNG
================================================= */
function renderChuong(dsChuong) {
  const box = document.getElementById("chuongList");
  if (!box) return;

  box.innerHTML = "";

  if (!dsChuong.length) {
    box.innerHTML = "<p>Chưa có chương</p>";
    return;
  }

  const isOwner =
    window.currentUser &&
    window.truyenHienTai &&
    window.currentUser.userId === window.truyenHienTai.tacGiaId;

  const isAdmin = window.currentUser && window.currentUser.capBac === 2;

  const coQuyen = isOwner || isAdmin;

  dsChuong
    .sort((a, b) => a.soChuong - b.soChuong)
    .forEach((c) => {
      const div = document.createElement("div");
      div.className = "chuong-item";

      div.innerHTML = `
        <div class="chuong-left">
          Chương ${c.soChuong}: ${c.tieuDe}
        </div>

        ${
          coQuyen
            ? `
          <div class="chuong-right">
            <button class="btn-sua" onclick="chonSuaChuong(${c.soChuong})">✏️</button>
            <button class="btn-xoa" onclick="xoaChuong(${c.soChuong})">🗑</button>
          </div>
        `
            : ""
        }
      `;

      box.appendChild(div);
    });
}

/* =================================================
   KHỞI ĐỘNG
================================================= */
document.addEventListener("DOMContentLoaded", loadChiTiet);
