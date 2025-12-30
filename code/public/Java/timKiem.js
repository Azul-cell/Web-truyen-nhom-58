const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchSuggest = document.getElementById("searchSuggest");

if (searchInput && searchBtn && searchSuggest) {
  // =============================
  // 🔍 TÌM & MỞ TRUYỆN
  // =============================
  function moTruyenTheoTen() {
    const key = searchInput.value.toLowerCase().trim();
    if (!key) return;

    // tìm truyện đầu tiên khớp
    const truyen = truyenDangLoc.find(
      (t) =>
        t.tenTruyen.toLowerCase().includes(key) ||
        (t.tacGia || "").toLowerCase().includes(key)
    );

    if (truyen) {
      location.href = `/Html/chiTiet.html?id=${truyen._id}`;
    } else {
      alert("❌ Không tìm thấy truyện phù hợp");
    }
  }

  // click nút search
  searchBtn.onclick = moTruyenTheoTen;

  // Enter
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") moTruyenTheoTen();
  });

  // =============================
  // ⭐ GỢI Ý TRUYỆN
  // =============================
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

    if (!goiY.length) {
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

      // 👉 CLICK LÀ MỞ TRUYỆN
      div.onclick = () => {
        location.href = `/Html/truyen.html?id=${t._id}`;
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
