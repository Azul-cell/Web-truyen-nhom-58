// DOM: tìm kiếm + nút + khung gợi ý
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchSuggest = document.getElementById("searchSuggest");

// Chỉ chạy khi đầy đủ các phần tử
if (searchInput && searchBtn && searchSuggest) {
  //TÌM KIẾM & MỞ TRUYỆN TRỰC TIẾP
  function moTruyenTheoTen() {
    // Lấy từ khoá, chuyển thường và xoá khoảng trắng
    const key = searchInput.value.toLowerCase().trim();
    if (!key) return;

    // Tìm truyện đầu tiên khớp tên hoặc tác giả
    const truyen = truyenDangLoc.find(
      (t) =>
        t.tenTruyen.toLowerCase().includes(key) ||
        (t.tacGia || "").toLowerCase().includes(key)
    );

    // Nếu tìm thấy → mở trang truyện
    if (truyen) {
      location.href = `/Html/truyen.html?id=${truyen._id}`;
    } else {
      alert("Không tìm thấy truyện phù hợp");
    }
  }

  // Click nút tìm kiếm
  searchBtn.onclick = moTruyenTheoTen;

  // Nhấn Enter trong ô input
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") moTruyenTheoTen();
  });

  //HIỂN THỊ GỢI Ý TRUYỆN KHI GÕ
  function hienGoiY(keyword) {
    keyword = keyword.toLowerCase().trim();

    // Không có từ khoá → ẩn gợi ý
    if (!keyword) {
      searchSuggest.style.display = "none";
      return;
    }

    // Lọc danh sách truyện theo tên / tác giả (tối đa 6)
    const goiY = truyenDangLoc
      .filter(
        (t) =>
          t.tenTruyen.toLowerCase().includes(keyword) ||
          (t.tacGia || "").toLowerCase().includes(keyword)
      )
      .slice(0, 6);

    // Không có gợi ý = ẩn
    if (!goiY.length) {
      searchSuggest.style.display = "none";
      return;
    }

    searchSuggest.innerHTML = "";

    // Render từng truyện gợi ý
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

      // Click gợi ý = mở truyện
      div.onclick = () => {
        location.href = `/Html/truyen.html?id=${t._id}`;
      };

      searchSuggest.appendChild(div);
    });

    // Hiện khung gợi ý
    searchSuggest.style.display = "block";
  }

  // Gõ tới đâu gợi ý tới đó
  searchInput.addEventListener("input", () => {
    hienGoiY(searchInput.value);
  });

  // Click ra ngoài ô search ẩn gợi ý
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) {
      searchSuggest.style.display = "none";
    }
  });
}
