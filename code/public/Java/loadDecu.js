/* =================================================
   LOAD TRUYỆN ĐỀ CỬ (FEATURED)
================================================= */
async function loadFeatured() {
  const box = document.getElementById("listFeatured");
  if (!box) return;

  try {
    const res = await fetch("/api/decu");

    if (!res.ok) {
      box.innerHTML = "<p>❌ Không tải được truyện đề cử</p>";
      return;
    }

    const data = await res.json();

    box.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      box.innerHTML = "<p>📭 Chưa có truyện đề cử</p>";
      return;
    }

    data.forEach((t) => {
      if (!t || !t._id) return;

      const div = document.createElement("div");
      div.className = "itemTruyen tag-wrapper"; // CSS xử lý position

      div.innerHTML = `
        <img src="${t.anhBia || "/img/default.jpg"}" />
        <div class="ten">${t.tenTruyen || "Không tên"}</div>
        <div class="chapter">Tác giả: ${t.tacGia || "Đang cập nhật"}</div>
      `;

      div.onclick = () => {
        location.href = "/Html/truyen.html?id=" + t._id;
      };

      box.appendChild(div);
    });
  } catch (err) {
    console.error("Lỗi load đề cử:", err);
    box.innerHTML = "<p>❌ Lỗi kết nối server</p>";
  }
}

/* =================================================
   INIT
================================================= */
document.addEventListener("DOMContentLoaded", loadFeatured);
