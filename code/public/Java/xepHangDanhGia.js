const container = document.getElementById("xepHangDanhGia");

/* ================= LOAD XẾP HẠNG ================= */
async function loadXepHang() {
  // 👉 tránh lỗi nếu script load nhầm trang
  if (!container) return;

  try {
    const res = await fetch("/api/xephang/danhgia");
    if (!res.ok) throw new Error("API lỗi");

    const ds = await res.json();
    container.innerHTML = "";

    if (!ds || ds.length === 0) {
      container.innerHTML = "<p>Chưa có dữ liệu đánh giá</p>";
      return;
    }

    ds.forEach((t, index) => {
      const div = document.createElement("div");
      div.className = "truyen";

      div.innerHTML = `
        <a href="/Html/truyen.html?id=${t._id}">
          <img src="${t.anhBia || "/img/default.jpg"}" />
        </a>

        <div class="ten">
          ${index + 1}. ${t.tenTruyen}
        </div>

        <div class="chapter">
          ⭐ ${Number(t.diemTB).toFixed(1)} / 5 (${t.soLuot} lượt)
        </div>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Lỗi xếp hạng:", err);
    container.innerHTML = "<p>❌ Lỗi tải xếp hạng</p>";
  }
}

/* ================= KHỞI ĐỘNG ================= */
document.addEventListener("DOMContentLoaded", loadXepHang);
