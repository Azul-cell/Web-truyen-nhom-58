// Số nút phân trang hiển thị tối đa trên một lần
const maxButtons = 5;

// Thẻ HTML chứa các nút phân trang
const phanTrang = document.getElementById("phanTrang");

// Hàm render các nút phân trang
function renderButtons() {
  // Nếu trang không có khu vực phân trang thì dừng
  if (!phanTrang) return;

  // Xoá nút cũ trước khi render lại
  phanTrang.innerHTML = "";

  // Tổng số trang = tổng truyện / số truyện mỗi trang
  const soTrang = Math.ceil(truyenDangTim.length / soTruyen);

  // Nếu chỉ có 1 trang thì không cần phân trang
  if (soTrang <= 1) return;

  // Nút Prev (trang trước)
  phanTrang.appendChild(
    taoNut(
      "Prev",
      trangHienTai === 1, // disable nếu đang ở trang đầu
      () => doiTrang(trangHienTai - 1) // giảm số trang
    )
  );

  // Xác định khoảng trang cần hiển thị
  let start = Math.max(1, trangHienTai - Math.floor(maxButtons / 2));
  let end = Math.min(soTrang, start + maxButtons - 1);

  // Tạo các nút số trang
  for (let i = start; i <= end; i++) {
    const btn = taoNut(i, false, () => doiTrang(i));

    // Đánh dấu trang hiện tại
    if (i === trangHienTai) btn.classList.add("active");

    phanTrang.appendChild(btn);
  }

  // Nút Next (trang sau)
  phanTrang.appendChild(
    taoNut(
      "Next",
      trangHienTai === soTrang, // disable nếu đang ở trang cuối
      () => doiTrang(trangHienTai + 1) // tăng số trang
    )
  );
}

// Hàm tạo 1 nút phân trang
function taoNut(text, disabled, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.disabled = disabled;
  btn.onclick = onClick;
  return btn;
}

// Hàm đổi trang
function doiTrang(trang) {
  trangHienTai = trang;

  // Render lại danh sách truyện nếu hàm tồn tại
  if (typeof renderNew === "function") {
    renderNew();
  }

  // Render lại các nút phân trang
  renderButtons();
}
