/* ===============================
   CẤU HÌNH CHUNG (GLOBAL)
================================ */
window.soTruyen = 24;

/* ===============================
   STATE CHUNG (DÙNG CHO MỌI FILE)
================================ */
window.truyenGoc = []; // danh sách truyện gốc
window.truyenDangLoc = []; // sau khi lọc thể loại
window.truyenDangTim = []; // sau khi tìm kiếm
window.trangHienTai = 1;

/* ===============================
   DOM
================================ */
const listTruyen = document.getElementById("listTruyen");

/* ===============================
   LOAD DANH SÁCH TRUYỆN
================================ */
async function loadTruyen() {
  try {
    const res = await fetch("/api/truyen");
    const data = await res.json();

    // gán state gốc
    window.truyenGoc = data;
    window.truyenDangLoc = data;
    window.truyenDangTim = data;
    window.trangHienTai = 1;

    renderAll();
  } catch (err) {
    console.error("❌ Lỗi load truyện:", err);
  }
}

/* ===============================
   RENDER TỔNG
================================ */
function renderAll() {
  renderNew();
  if (typeof renderButtons === "function") {
    renderButtons(); // từ phanTrang.js
  }
}

/* ===============================
   RENDER DANH SÁCH TRUYỆN
================================ */
function renderNew() {
  if (!listTruyen) return;

  listTruyen.innerHTML = "";

  const start = (window.trangHienTai - 1) * window.soTruyen;
  const end = window.trangHienTai * window.soTruyen;

  window.truyenDangTim.slice(start, end).forEach((t) => {
    listTruyen.innerHTML += renderItem(t);
  });
}

/* ===============================
   RENDER 1 TRUYỆN
================================ */
function renderItem(t) {
  return `
    <div class="truyen" data-id="${t._id}">
      <img src="${t.anhBia || "/img/default.jpg"}" />
      <p class="ten">${t.tenTruyen}</p>
      <p class="chapter">Tác giả: ${t.tacGia || "Đang cập nhật"}</p>
    </div>
  `;
}

/* ===============================
   CLICK TRUYỆN → CHI TIẾT
================================ */
document.addEventListener("click", (e) => {
  const truyen = e.target.closest(".truyen");
  if (!truyen) return;

  const id = truyen.dataset.id;
  if (!id) return;

  window.location.href = `/Html/truyen.html?id=${id}`;
});

/* ===============================
   KHỞI ĐỘNG
================================ */
document.addEventListener("DOMContentLoaded", loadTruyen);
