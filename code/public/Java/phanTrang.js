const maxButtons = 5;
const phanTrang = document.getElementById("phanTrang");

function renderButtons() {
  // ❗ không có phân trang → thoát
  if (!phanTrang) return;

  phanTrang.innerHTML = "";

  const soTrang = Math.ceil(truyenDangTim.length / soTruyen);
  if (soTrang <= 1) return;

  // Prev
  phanTrang.appendChild(
    taoNut("Prev", trangHienTai === 1, () => doiTrang(trangHienTai - 1))
  );

  let start = Math.max(1, trangHienTai - Math.floor(maxButtons / 2));
  let end = Math.min(soTrang, start + maxButtons - 1);

  // các nút số
  for (let i = start; i <= end; i++) {
    const btn = taoNut(i, false, () => doiTrang(i));
    if (i === trangHienTai) btn.classList.add("active");
    phanTrang.appendChild(btn);
  }

  // Next
  phanTrang.appendChild(
    taoNut("Next", trangHienTai === soTrang, () => doiTrang(trangHienTai + 1))
  );
}

function taoNut(text, disabled, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.disabled = disabled;
  btn.onclick = onClick;
  return btn;
}

function doiTrang(trang) {
  trangHienTai = trang;

  // ❗ chỉ gọi khi tồn tại
  if (typeof renderNew === "function") {
    renderNew();
  }

  renderButtons();
}
