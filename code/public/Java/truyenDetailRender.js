function renderChuong(dsChuong, truyenId) {
  const box = document.getElementById("chuongList");
  box.innerHTML = "";

  if (!dsChuong || dsChuong.length === 0) {
    box.innerHTML = "<p>Truyện chưa có chương</p>";
    return;
  }

  dsChuong.forEach((c) => {
    const div = document.createElement("div");
    div.className = "chuong-item";

    div.innerHTML = `
      <span><b>Chương ${c.soChuong}:</b> ${c.tieuDe}</span>
      <span class="chuong-tools">
          <button onclick="chonSuaChuong(${c.soChuong})">✏️</button>
          <button onclick="xoaChuong(${c.soChuong})">🗑️</button>
      </span>
    `;

    div.onclick = (e) => {
      if (e.target.tagName === "BUTTON") return;
      location.href = `/Html/chuong.html?truyen=${truyenId}&chuong=${c.soChuong}`;
    };

    box.appendChild(div);
  });
}
