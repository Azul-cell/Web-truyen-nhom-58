const btnTheLoai = document.querySelector(".theLoai"); // nút "Thể Loại"
const navBar = document.getElementById("navBarHide"); // thanh navbar thể loại

// CLICK để mở/đóng
btnTheLoai.addEventListener("click", (e) => {
  e.stopPropagation(); // không cho nổi bọt

  if (navBar.style.display === "flex") {
    navBar.style.display = "none"; // đang mở -> đóng
  } else {
    navBar.style.display = "flex"; // đang đóng -> mở
  }
});

// CLICK vào menu không đóng
navBar.addEventListener("click", (e) => {
  e.stopPropagation();
});

// CLICK ra ngoài để đóng menu
document.addEventListener("click", () => {
  navBar.style.display = "none";
});
