function renderChuong(dsChuong, truyen) {
  const box = document.getElementById("chuongList");
  box.innerHTML = "";

  if (!dsChuong || dsChuong.length === 0) {
    box.innerHTML = "<p>Truyện chưa có chương</p>";
    return;
  }

  const user = window.currentUser;

  // ===== CHECK QUYỀN =====
  const laAdmin = user && user.capBac === 2;

  const laTacGia =
    user &&
    user.capBac === 1 &&
    truyen.tacGiaId &&
    truyen.tacGiaId.toString() === user._id;

  const coQuyen = laAdmin || laTacGia;

  console.log("USER:", user);
  console.log("TRUYEN TAC GIA ID:", truyen.tacGiaId);
  console.log("CO QUYEN:", coQuyen);

  dsChuong
    .sort((a, b) => a.soChuong - b.soChuong)
    .forEach((c) => {
      const div = document.createElement("div");
      div.className = "chuong-item";

      div.innerHTML = `
        <span>
          <b>Chương ${c.soChuong}:</b> ${c.tieuDe}
        </span>

        ${
          coQuyen
            ? `
          <span class="chuong-tools">
            <button onclick="chonSuaChuong(${c.soChuong}); event.stopPropagation()">✏️</button>
            <button onclick="xoaChuong(${c.soChuong}); event.stopPropagation()">🗑️</button>
          </span>
        `
            : ""
        }
      `;

      div.onclick = () => {
        location.href = `/Html/chuong.html?truyen=${truyen._id}&chuong=${c.soChuong}`;
      };

      box.appendChild(div);
    });
}
