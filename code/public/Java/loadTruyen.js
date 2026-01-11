//Số truyện hiển thị trên mỗi trang
window.soTruyen = 18;

//STATE CHUNG (DÙNG TOÀN HỆ THỐNG)
window.truyenGoc = []; // Danh sách truyện gốc từ server
window.truyenDangLoc = []; // Danh sách sau khi lọc theo thể loại
window.truyenDangTim = []; // Danh sách sau khi tìm kiếm
window.trangHienTai = 1; // Trang hiện tại

//DOM ELEMENT
const listTruyen = document.getElementById("listTruyen");

//LOAD DANH SÁCH TRUYỆN TỪ SERVER
async function loadTruyen() {
  try {
    const res = await fetch("/api/truyen");
    const data = await res.json();

    // Gán dữ liệu cho state toàn cục
    window.truyenGoc = data;
    window.truyenDangLoc = data;
    window.truyenDangTim = data;
    window.trangHienTai = 1;

    // Render giao diện
    renderAll();
  } catch (err) {
    console.error("❌ Lỗi load truyện:", err);
  }
}

//RENDER TỔNG (TRUYỆN + PHÂN TRANG)
function renderAll() {
  renderNew();

  // Gọi phân trang
  if (typeof renderButtons === "function") {
    renderButtons();
  }
}

//RENDER DANH SÁCH TRUYỆN THEO TRANG
function renderNew() {
  if (!listTruyen) return;

  listTruyen.innerHTML = "";

  // Tính vị trí bắt đầu – kết thúc của trang hiện tại
  const start = (window.trangHienTai - 1) * window.soTruyen;
  const end = window.trangHienTai * window.soTruyen;

  // Render các truyện trong trang
  window.truyenDangTim.slice(start, end).forEach((t) => {
    listTruyen.innerHTML += renderItem(t);
  });
}

//RENDER 1 ITEM TRUYỆN
function renderItem(t) {
  return `
    <div class="truyen" data-id="${t._id}">
      <img src="${t.anhBia || "/img/default.jpg"}" />
      <p class="ten">${t.tenTruyen}</p>
      <p class="chapter">Tác giả: ${t.tacGia || "Đang cập nhật"}</p>
    </div>
  `;
}

//CLICK TRUYỆN → CHUYỂN TRANG TRUYỆN
document.addEventListener("click", (e) => {
  const truyen = e.target.closest(".truyen");
  if (!truyen) return;

  const id = truyen.dataset.id;
  if (!id) return;

  window.location.href = `/Html/truyen.html?id=${id}`;
});

//Tự động load danh sách truyện khi trang mở
document.addEventListener("DOMContentLoaded", loadTruyen);
