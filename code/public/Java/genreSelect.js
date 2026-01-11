//CHỌN THỂ LOẠI (DÙNG KHI ĐĂNG TRUYỆN)

// Lưu danh sách thể loại đã chọn (Set giúp không bị trùng)
const selectedGenres = new Set();

// Khung hiển thị các thể loại đã chọn
const box = document.getElementById("selectedGenres");

// Cờ kiểm tra để tránh gắn sự kiện click nhiều lần
let genreEventBound = false;

//KHỞI TẠO CHỌN THỂ LOẠI
function initGenreSelect() {
  // Nếu đã khởi tạo rồi thì không làm lại
  if (genreEventBound) return;
  genreEventBound = true;

  // Lấy tất cả thẻ <a> trong khung thể loại
  document.querySelectorAll(".hopTheLoai a").forEach((item) => {
    // Thêm class để đồng bộ CSS
    item.classList.add("genre");

    // Bắt sự kiện click chọn / bỏ chọn thể loại
    item.addEventListener("click", () => {
      const genre = item.innerText.trim();

      // Nếu đã chọn → bỏ chọn
      if (selectedGenres.has(genre)) {
        selectedGenres.delete(genre);
        item.classList.remove("active-genre");
      }
      // Nếu chưa chọn → thêm vào danh sách
      else {
        selectedGenres.add(genre);
        item.classList.add("active-genre");
      }

      // Cập nhật giao diện hiển thị
      renderGenres();
    });
  });

  // Hiển thị trạng thái ban đầu
  renderGenres();
}

//HIỂN THỊ CÁC THỂ LOẠI ĐÃ CHỌN
function renderGenres() {
  if (!box) return;

  // Chưa chọn thể loại nào
  if (selectedGenres.size === 0) {
    box.innerText = "Chưa chọn thể loại";
  }
  // Hiển thị danh sách thể loại đã chọn
  else {
    box.innerText = [...selectedGenres].join(", ");
  }
}

//LẤY DANH SÁCH THỂ LOẠI (DÙNG KHI GỬI API addTruyen)
function getSelectedGenres() {
  return [...selectedGenres];
}

//RESET THỂ LOẠI (SAU KHI ĐĂNG TRUYỆN THÀNH CÔNG)
function clearSelectedGenres() {
  // Xóa toàn bộ thể loại đã chọn
  selectedGenres.clear();

  // Gỡ class active trên giao diện
  document.querySelectorAll(".hopTheLoai a").forEach((item) => {
    item.classList.remove("active-genre");
  });

  // Cập nhật hiển thị
  renderGenres();
}

//TỰ ĐỘNG KHỞI TẠO KHI TRANG LOAD
document.addEventListener("DOMContentLoaded", initGenreSelect);
