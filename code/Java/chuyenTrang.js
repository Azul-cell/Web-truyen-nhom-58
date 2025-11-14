const itemsPerPage = 2; // mỗi trang hiển thị 3 truyện
const items = document.querySelectorAll(".truyen");
const totalPages = Math.ceil(items.length / itemsPerPage);
const pagination = document.getElementById("pagination");
function showPage(page) {
  items.forEach((item, i) => {
    item.style.display =
      i >= (page - 1) * itemsPerPage && i < page * itemsPerPage
        ? "block"
        : "none";
  });

  // cập nhật nút
  document.querySelectorAll(".pagination button").forEach((btn, i) => {
    btn.classList.toggle("active", i + 1 === page);
  });
}

// tạo nút
for (let i = 1; i <= totalPages; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.addEventListener("click", () => showPage(i));
  pagination.appendChild(btn);
}

showPage(1);
