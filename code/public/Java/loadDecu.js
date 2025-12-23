async function loadFeatured() {
  try {
    const res = await fetch("/api/decu"); // ✅ API MỚI
    const data = await res.json();

    const box = document.getElementById("listFeatured");
    if (!box) return;

    box.innerHTML = "";

    data.forEach((t) => {
      const div = document.createElement("div");
      div.className = "itemTruyen";
      div.style.position = "relative";

      div.innerHTML = `
        <span class="tag-decu">ĐỀ CỬ</span>
        <img src="${t.anhBia || "/img/default.jpg"}">
        <div class="ten">${t.tenTruyen}</div>
        <div class="chapter">Tác giả: ${t.tacGia}</div>
      `;

      div.onclick = () => {
        location.href = "/Html/chiTiet.html?id=" + t._id;
      };

      box.appendChild(div);
    });
  } catch (err) {
    console.error("Lỗi load đề cử", err);
  }
}

document.addEventListener("DOMContentLoaded", loadFeatured);
