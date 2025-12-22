const selectedGenres = new Set();
const box = document.getElementById("selectedGenres");

document.querySelectorAll(".hopTheLoai a").forEach((item) => {
  item.classList.add("genre");

  item.addEventListener("click", () => {
    const genre = item.innerText.trim();

    if (selectedGenres.has(genre)) {
      selectedGenres.delete(genre);
      item.classList.remove("active");
    } else {
      selectedGenres.add(genre);
      item.classList.add("active");
    }

    renderGenres();
  });
});

function renderGenres() {
  if (selectedGenres.size === 0) {
    box.innerText = "Chưa chọn thể loại";
  } else {
    box.innerText = [...selectedGenres].join(", ");
  }
}

function getSelectedGenres() {
  return [...selectedGenres];
}
