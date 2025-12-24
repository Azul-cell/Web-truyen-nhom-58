function renderChuong(dsChuong, truyenId) {
  const box = document.getElementById("chuongList");
  box.innerHTML = "";

  if (!dsChuong || dsChuong.length === 0) {
    box.innerHTML = "<p>Truyện chưa có chương</p>";
    return;
  }

  // 👉 LẤY USER HIỆN TẠI (đã có từ /api/me)
  // checkAdmin() đã chạy trước đó
  const user = window.currentUser || null;

  // 👉 kiểm tra quyền đăng / sửa chương
  const coQuyenQuanLyChuong = user && user.capBac >= 1;

  dsChuong.forEach((c) => {
    const div = document.createElement("div");
    div.className = "chuong-item";

    // 👉 chỉ render nút ✏️ 🗑️ nếu có quyền
    const toolsHTML = coQuyenQuanLyChuong
      ? `
        <span class="chuong-tools">
          <button onclick="chonSuaChuong(${c.soChuong})">✏️</button>
          <button onclick="xoaChuong(${c.soChuong})">🗑️</button>
        </span>
      `
      : "";

    div.innerHTML = `
      <span><b>Chương ${c.soChuong}:</b> ${c.tieuDe}</span>
      ${toolsHTML}
    `;

    // 👉 click đọc chương (trừ khi bấm nút)
    div.onclick = (e) => {
      if (e.target.tagName === "BUTTON") return;

      location.href = `/Html/chuong.html?truyen=${truyenId}&chuong=${c.soChuong}`;
    };

    box.appendChild(div);
  });
}
