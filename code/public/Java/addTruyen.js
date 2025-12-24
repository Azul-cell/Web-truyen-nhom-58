/* =================================================
   THÊM TRUYỆN MỚI
   - Chỉ Tác giả (capBac >= 1) hoặc Admin
   - JWT được gửi qua cookie
================================================= */
async function addTruyen() {
  /* ---------- LẤY DỮ LIỆU TỪ FORM ---------- */

  // Tên truyện
  const tenTruyen = document.getElementById("title").value.trim();

  // Tên tác giả hiển thị (snapshot)
  const tacGia = document.getElementById("author").value.trim();

  // Link ảnh bìa
  const anhBia = document.getElementById("cover").value.trim();

  // Mô tả truyện
  const moTa = document.getElementById("desc").value.trim();

  // Danh sách thể loại được chọn
  const theLoai = getSelectedGenres(); // trả về mảng

  /* ---------- VALIDATE PHÍA FRONTEND ---------- */

  if (!tenTruyen) {
    alert("Vui lòng nhập tên truyện");
    return;
  }

  if (!tacGia) {
    alert("Vui lòng nhập tên tác giả");
    return;
  }

  if (theLoai.length === 0) {
    alert("Vui lòng chọn ít nhất một thể loại");
    return;
  }

  /* ---------- GỬI REQUEST ---------- */

  const res = await fetch("/api/truyen", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    // ⭐ RẤT QUAN TRỌNG
    // Gửi cookie JWT để backend biết user là ai
    credentials: "same-origin",

    // ⭐ KHÔNG gửi userId / capBac
    // Backend sẽ lấy từ req.user (JWT)
    body: JSON.stringify({
      tenTruyen,
      tacGia,
      theLoai,
      moTa,
      anhBia,
    }),
  });

  /* ---------- XỬ LÝ RESPONSE ---------- */

  const text = await res.text();

  try {
    const data = JSON.parse(text);
    alert(data.message);
  } catch (err) {
    console.error("Server trả về:", text);
    alert("Server lỗi (không phải JSON)");
  }

  /* ---------- RESET FORM NẾU THÀNH CÔNG ---------- */

  if (res.ok) {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("cover").value = "";
    document.getElementById("desc").value = "";

    clearSelectedGenres(); // hàm bạn đã có
  }
}
