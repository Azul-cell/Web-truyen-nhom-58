const btnTheLoai = document.getElementById("theLoaiBtn"); // nút Thể Loại
const megaContainer = document.querySelector(".mega-menu-container");

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
