// Lấy nút "Tất cả thể loại"
const btnAll = document.querySelector(".genre-all");

// Hàm xoá trạng thái active của tất cả thể loại
function clearActiveGenre() {
  // Lấy tất cả nút thể loại và nút "Tất cả"
  document.querySelectorAll(".genre, .genre-all").forEach((el) =>
    // Xoá class active-genre để reset trạng thái
    el.classList.remove("active-genre")
  );
}

// Gắn sự kiện click cho từng thể loại riêng lẻ
document.querySelectorAll(".genre").forEach((item) => {
  item.addEventListener("click", () => {
    // Xoá trạng thái active cũ
    clearActiveGenre();

    // Thêm trạng thái active cho thể loại đang chọn
    item.classList.add("active-genre");

    // Lấy tên thể loại từ nội dung nút
    const theLoai = item.textContent.trim();

    // Khi đổi thể loại quay về trang 1
    trangHienTai = 1;

    // Lọc truyện theo thể loại từ danh sách gốc
    truyenDangLoc = truyenGoc.filter(
      (t) =>
        // Kiểm tra theLoai là mảng để tránh lỗi
        Array.isArray(t.theLoai) &&
        // Kiểm tra truyện có thuộc thể loại đang chọn không
        t.theLoai.includes(theLoai)
    );

    // Đồng bộ danh sách tìm kiếm với danh sách đã lọc
    truyenDangTim = truyenDangLoc;

    // Render lại toàn bộ giao diện (truyện + phân trang)
    renderAll();
  });
});

// Gắn sự kiện click cho nút "Tất cả"
btnAll?.addEventListener("click", () => {
  // Xoá trạng thái active của các thể loại khác
  clearActiveGenre();

  // Đánh dấu nút "Tất cả" đang được chọn
  btnAll.classList.add("active-genre");

  // Reset về trang đầu
  trangHienTai = 1;

  // Khôi phục danh sách truyện ban đầu (không lọc)
  truyenDangLoc = truyenGoc;

  // Đồng bộ danh sách tìm kiếm
  truyenDangTim = truyenDangLoc;

  // Render lại giao diện
  renderAll();
});
