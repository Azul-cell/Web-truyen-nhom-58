const container = document.getElementById("xepHangDanhGia");

async function loadXepHang() {
  try {
    const res = await fetch("/api/xephang/danhgia");
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
        <a href="/Html/truyenDetail.html?id=${t._id}">
          <img src="${t.anhBia || "/img/default.jpg"}" />
        </a>
        <div class="ten">${index + 1}. ${t.tenTruyen}</div>
        <div class="chapter">
          ⭐ ${t.diemTB} / 5 (${t.soLuot} lượt)
        </div>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Lỗi tải xếp hạng</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadXepHang);
