// Nút bấm "Thể loại" trên menu
const btnTheLoai = document.getElementById("theLoaiBtn");

// Khung mega menu chứa danh sách thể loại
const megaContainer = document.querySelector(".mega-menu-container");

// Nếu trang hiện tại KHÔNG có mega menu thì không xử lý gì
if (btnTheLoai && megaContainer) {
  // Click vào nút Thể loại = bật / tắt
  btnTheLoai.addEventListener("click", (e) => {
    e.stopPropagation(); // chặn sự kiện lan ra document
    megaContainer.classList.toggle("active");
  });

  // Click bên trong menu = không đóng
  megaContainer.addEventListener("click", (e) => {
    e.stopPropagation(); // giữ menu đang mở
  });

  // Click ra ngoài = đóng
  document.addEventListener("click", () => {
    megaContainer.classList.remove("active");
  });
}
