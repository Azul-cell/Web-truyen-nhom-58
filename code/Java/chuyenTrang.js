const soTruyen = 1;
const truyen = document.querySelectorAll(".truyen");
const soTrang = Math.ceil(truyen.length / soTruyen);
const phanTrang = document.getElementById("phanTrang");

let currentPage = 1;
const maxButtons = 3; //GIỚI HẠN SỐ NÚT HIỂN THỊ

function showPage(trang) {
  if (trang < 1) trang = 1;
  if (trang > soTrang) trang = soTrang;

  currentPage = trang;

  // Hiển thị truyện theo trang
  truyen.forEach((item, i) => {
    item.style.display =
      i >= (trang - 1) * soTruyen && i < trang * soTruyen ? "block" : "none";
  });

  renderButtons(); // luôn cập nhật lại nút phân trang
}

function renderButtons() {
  phanTrang.innerHTML = ""; // xoá nút cũ

  // === PREV ===
  const prev = document.createElement("button");
  prev.textContent = "Prev";
  prev.disabled = currentPage === 1;
  prev.addEventListener("click", () => showPage(currentPage - 1));
  phanTrang.appendChild(prev);

  // === TÍNH RANGE NÚT ===
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;

  if (end > soTrang) {
    end = soTrang;
    start = Math.max(1, end - maxButtons + 1);
  }

  // === "..." phía trước ===
  if (start > 1) {
    const dotStart = document.createElement("button");
    dotStart.textContent = "...";
    dotStart.disabled = true;
    phanTrang.appendChild(dotStart);
  }

  // === NÚT SỐ TRANG ===
  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("page");

    if (i === currentPage) btn.classList.add("active");

    btn.addEventListener("click", () => showPage(i));
    phanTrang.appendChild(btn);
  }

  // === "..." phía sau ===
  if (end < soTrang) {
    const dotEnd = document.createElement("button");
    dotEnd.textContent = "...";
    dotEnd.disabled = true;
    phanTrang.appendChild(dotEnd);
  }

  // === NEXT ===
  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = currentPage === soTrang;
  next.addEventListener("click", () => showPage(currentPage + 1));
  phanTrang.appendChild(next);
}

// luôn hiển thị trang 1
showPage(1);
