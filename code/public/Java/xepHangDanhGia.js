// Lấy container hiển thị bảng xếp hạng đánh giá
const container = document.getElementById("xepHangDanhGia");

/* ================= LOAD XẾP HẠNG ĐÁNH GIÁ ================= */
async function loadXepHang() {
  // Tránh lỗi nếu file JS được load ở trang không có xếp hạng
  if (!container) return;

  try {
    // Gọi API lấy danh sách truyện theo điểm đánh giá
    const res = await fetch("/api/xephang/danhgia");
    if (!res.ok) throw new Error("API lỗi");

    // Parse JSON
    const ds = await res.json();
    container.innerHTML = "";

    // Không có dữ liệu
    if (!ds || ds.length === 0) {
      container.innerHTML = "<p>Chưa có dữ liệu đánh giá</p>";
      return;
    }

    /* ================= RENDER DANH SÁCH ================= */
    ds.forEach((t, index) => {
      // Tạo thẻ truyện
      const div = document.createElement("div");
      div.className = "truyen";

      // HTML hiển thị mỗi truyện trong bảng xếp hạng
      div.innerHTML = `
        <!-- Ảnh bìa (click để vào trang truyện) -->
        <a href="/Html/truyen.html?id=${t._id}">
          <img src="${t.anhBia || "/img/default.jpg"}" />
        </a>

        <!-- Tên truyện + thứ hạng -->
        <div class="ten">
          ${index + 1}. ${t.tenTruyen}
        </div>

        <!-- Điểm đánh giá -->
        <div class="chapter">
          ⭐ ${Number(t.diemTB).toFixed(1)} / 5 (${t.soLuot} lượt)
        </div>
      `;

      // Thêm truyện vào container
      container.appendChild(div);
    });
  } catch (err) {
    // Lỗi khi gọi API hoặc render
    console.error("Lỗi xếp hạng:", err);
    container.innerHTML = "<p>Lỗi tải xếp hạng</p>";
  }
}

/* ================= KHỞI ĐỘNG ================= */
// Load xếp hạng khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", loadXepHang);
