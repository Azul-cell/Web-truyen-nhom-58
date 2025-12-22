// ===== CẤU HÌNH =====
const soTruyen = 24;

// ===== STATE CHUNG =====
let danhSachTruyen = [];
let truyenDangLoc = [];
let truyenDangTim = [];
let trangHienTai = 1;

// ===== DOM =====
const listFeatured = document.getElementById("listFeatured");
const listTruyen = document.getElementById("listTruyen");

// ===== LOAD =====
async function loadTruyen() {
  const res = await fetch("http://localhost:4000/api/truyen");
  danhSachTruyen = await res.json();

  truyenDangLoc = danhSachTruyen;
  truyenDangTim = truyenDangLoc;

  renderAll();
}

// ===== RENDER =====
function renderAll() {
  renderFeatured();
  renderNew();
  renderButtons(); // từ phanTrang.js
}

function renderFeatured() {
  listFeatured.innerHTML = "";
  truyenDangTim.slice(0, 3).forEach((t) => {
    listFeatured.innerHTML += renderItem(t);
  });
}

function renderNew() {
  listTruyen.innerHTML = "";

  const start = (trangHienTai - 1) * soTruyen;
  const end = trangHienTai * soTruyen;

  truyenDangTim.slice(start, end).forEach((t) => {
    listTruyen.innerHTML += renderItem(t);
  });
}

function renderItem(t) {
  return `
    <div class="truyen" data-id="${t._id}">
      <img src="${t.anhBia || "/img/default.jpg"}">
      <p class="ten">${t.tenTruyen}</p>
      <p class="chapter">Tác giả: ${t.tacGia}</p>
    </div>
  `;
}
document.addEventListener("click", (e) => {
  const truyen = e.target.closest(".truyen");
  if (!truyen) return;

  const id = truyen.dataset.id;
  if (!id) return;

  // chuyển sang trang chi tiết
  window.location.href = `/Html/truyen.html?id=${id}`;
});

// ===== CHẠY =====
loadTruyen();
