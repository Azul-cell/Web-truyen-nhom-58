/* ======= THÊM TRUYỆN MỚI  ======= */

async function addTruyen() {
  /* ===== LẤY DỮ LIỆU NGƯỜI DÙNG NHẬP ===== */

  // Lấy tên truyện từ input
  const tenTruyen = document.getElementById("title").value.trim();

  // Lấy tên tác giả hiển thị (lưu theo thời điểm đăng)
  const tacGia = document.getElementById("author").value.trim();

  // Lấy link ảnh bìa truyện
  const anhBia = document.getElementById("cover").value.trim();

  // Lấy mô tả nội dung truyện
  const moTa = document.getElementById("desc").value.trim();

  // Lấy danh sách thể loại mà người dùng đã chọn
  const theLoai = getSelectedGenres(); // trả về mảng thể loại

  /* ===== KIỂM TRA DỮ LIỆU PHÍA CLIENT ===== */

  // Kiểm tra tên truyện
  if (!tenTruyen) {
    alert("Vui lòng nhập tên truyện");
    return;
  }

  // Kiểm tra tên tác giả
  if (!tacGia) {
    alert("Vui lòng nhập tên tác giả");
    return;
  }

  // Bắt buộc phải chọn ít nhất một thể loại
  if (theLoai.length === 0) {
    alert("Vui lòng chọn ít nhất một thể loại");
    return;
  }

  /* ===== GỬI REQUEST LÊN SERVER ===== */

  const res = await fetch("/api/truyen", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    // Cho phép gửi cookie để server xác định người dùng
    credentials: "same-origin",

    // Không gửi thông tin quyền hay userId từ frontend
    // Server sẽ lấy từ JWT sau khi xác thực
    body: JSON.stringify({
      tenTruyen,
      tacGia,
      theLoai,
      moTa,
      anhBia,
    }),
  });

  /* ===== XỬ LÝ PHẢN HỒI TỪ SERVER ===== */

  const text = await res.text();

  try {
    const data = JSON.parse(text);
    alert(data.message);
  } catch (err) {
    console.error("Response không hợp lệ:", text);
    alert("Có lỗi xảy ra phía server");
  }

  /* ===== RESET FORM KHI THÊM THÀNH CÔNG ===== */

  if (res.ok) {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("cover").value = "";
    document.getElementById("desc").value = "";

    clearSelectedGenres(); // reset các thể loại đã chọn
  }
}
