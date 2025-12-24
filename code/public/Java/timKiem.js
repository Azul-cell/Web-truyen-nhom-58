const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchSuggest = document.getElementById("searchSuggest");

// nếu trang không có search → dừng
if (searchInput && searchBtn && searchSuggest) {
  function timKiem() {
    const key = searchInput.value.toLowerCase().trim();
    trangHienTai = 1;

    truyenDangTim = key
      ? truyenDangLoc.filter(
          (t) =>
            t.tenTruyen.toLowerCase().includes(key) ||
            (t.tacGia || "").toLowerCase().includes(key)
        )
      : truyenDangLoc;

    searchSuggest.style.display = "none";

    if (typeof renderAll === "function") {
      renderAll();
    }
  }

  searchBtn.onclick = timKiem;

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") timKiem();
  });

  /* ===== GỢI Ý ===== */
  function hienGoiY(keyword) {
    keyword = keyword.toLowerCase().trim();

    if (!keyword) {
      searchSuggest.style.display = "none";
      return;
    }

    const goiY = truyenDangLoc
      .filter(
        (t) =>
          t.tenTruyen.toLowerCase().includes(keyword) ||
          (t.tacGia || "").toLowerCase().includes(keyword)
      )
      .slice(0, 6);

    if (goiY.length === 0) {
      searchSuggest.style.display = "none";
      return;
    }

    searchSuggest.innerHTML = "";

    goiY.forEach((t) => {
      const div = document.createElement("div");
      div.className = "suggest-item";

      div.innerHTML = `
        <div class="thumb">
          <img src="${t.anhBia || "/img/default.jpg"}">
        </div>
        <div class="info">
          <div class="title">${t.tenTruyen}</div>
          <div class="author">${t.tacGia || "Đang cập nhật"}</div>
        </div>
      `;

      div.onclick = () => {
        searchInput.value = t.tenTruyen;
        timKiem();
      };

      searchSuggest.appendChild(div);
    });

    searchSuggest.style.display = "block";
  }

  searchInput.addEventListener("input", () => {
    hienGoiY(searchInput.value);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) {
      searchSuggest.style.display = "none";
    }
  });
}
