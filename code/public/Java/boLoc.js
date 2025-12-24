const btnAll = document.querySelector(".genre-all");

function clearActiveGenre() {
  document
    .querySelectorAll(".genre, .genre-all")
    .forEach((el) => el.classList.remove("active-genre"));
}

document.querySelectorAll(".genre").forEach((item) => {
  item.addEventListener("click", () => {
    clearActiveGenre();
    item.classList.add("active-genre");

    const theLoai = item.textContent.trim();
    trangHienTai = 1;

    // ⭐ DÙNG DANH SÁCH GỐC CỦA TRANG
    truyenDangLoc = truyenGoc.filter(
      (t) => Array.isArray(t.theLoai) && t.theLoai.includes(theLoai)
    );

    truyenDangTim = truyenDangLoc;
    renderAll();
  });
});

btnAll?.addEventListener("click", () => {
  clearActiveGenre();
  btnAll.classList.add("active-genre");

  trangHienTai = 1;

  // ⭐ RESET VỀ DANH SÁCH GỐC
  truyenDangLoc = truyenGoc;
  truyenDangTim = truyenDangLoc;

  renderAll();
});
