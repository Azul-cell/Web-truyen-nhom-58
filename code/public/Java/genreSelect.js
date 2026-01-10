/* =================================================
   CHỌN THỂ LOẠI (DÙNG KHI ĐĂNG TRUYỆN)
================================================= */

//  Lưu thể loại đã chọn (không trùng)
const selectedGenres = new Set();

// Box hiển thị thể loại đã chọn
const box = document.getElementById("selectedGenres");

// Tránh gắn event nhiều lần
let genreEventBound = false;

/* =================================================
   INIT
================================================= */
function initGenreSelect() {
  if (genreEventBound) return;
  genreEventBound = true;

  document.querySelectorAll(".hopTheLoai a").forEach((item) => {
    item.classList.add("genre");

    item.addEventListener("click", () => {
      const genre = item.innerText.trim();

      if (selectedGenres.has(genre)) {
        selectedGenres.delete(genre);
        item.classList.remove("active-genre");
      } else {
        selectedGenres.add(genre);
        item.classList.add("active-genre");
      }

      renderGenres();
    });
  });

  renderGenres();
}

/* =================================================
   HIỂN THỊ THỂ LOẠI ĐÃ CHỌN
================================================= */
function renderGenres() {
  if (!box) return;

  if (selectedGenres.size === 0) {
    box.innerText = "Chưa chọn thể loại";
  } else {
    box.innerText = [...selectedGenres].join(", ");
  }
}

/* =================================================
   LẤY DANH SÁCH THỂ LOẠI (CHO addTruyen)
================================================= */
function getSelectedGenres() {
  return [...selectedGenres];
}

/* =================================================
   RESET THỂ LOẠI (SAU KHI ĐĂNG TRUYỆN)
================================================= */
function clearSelectedGenres() {
  selectedGenres.clear();

  document.querySelectorAll(".hopTheLoai a").forEach((item) => {
    item.classList.remove("active-genre");
  });

  renderGenres();
}

/* =================================================
   AUTO INIT
================================================= */
document.addEventListener("DOMContentLoaded", initGenreSelect);
