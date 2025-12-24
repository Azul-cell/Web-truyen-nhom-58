const btnTheLoai = document.getElementById("theLoaiBtn");
const megaContainer = document.querySelector(".mega-menu-container");

// nếu trang KHÔNG có mega menu thì dừng
if (btnTheLoai && megaContainer) {
  // click Thể Loại → mở / đóng
  btnTheLoai.addEventListener("click", (e) => {
    e.stopPropagation();
    megaContainer.classList.toggle("active");
  });

  // click trong menu → không đóng
  megaContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // click ra ngoài → đóng
  document.addEventListener("click", () => {
    megaContainer.classList.remove("active");
  });
}
