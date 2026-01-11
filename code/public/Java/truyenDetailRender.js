//Render danh sách chương của truyện
function renderChuong(dsChuong, truyen) {
  // Lấy container chứa danh sách chương
  const box = document.getElementById("chuongList");
  box.innerHTML = "";

  // Nếu truyện chưa có chương
  if (!dsChuong || dsChuong.length === 0) {
    box.innerHTML = "<p>Truyện chưa có chương</p>";
    return;
  }

  // User đang đăng nhập (load từ API /api/me)
  const user = window.currentUser;

  /* ================= CHECK QUYỀN ================= */

  // Kiểm tra admin (capBac = 2)
  const laAdmin = user && user.capBac === 2;

  // Kiểm tra tác giả truyện (capBac = 1 và đúng tacGiaId)
  const laTacGia =
    user && // đã đăng nhập
    user.capBac === 1 && // là tác giả
    truyen.tacGiaId && // truyện có tác giả
    truyen.tacGiaId.toString() === user._id; // đúng người đăng

  // Có quyền sửa / xoá chương
  const coQuyen = laAdmin || laTacGia;

  // Debug (có thể xoá khi chạy ổn)
  console.log("USER:", user);
  console.log("TRUYEN TAC GIA ID:", truyen.tacGiaId);
  console.log("CO QUYEN:", coQuyen);

  /* ================= RENDER CHƯƠNG ================= */

  // Sắp xếp chương theo số chương tăng dần
  dsChuong
    .sort((a, b) => a.soChuong - b.soChuong)
    .forEach((c) => {
      // Tạo phần tử chương
      const div = document.createElement("div");
      div.className = "chuong-item";

      // Nội dung hiển thị chương
      div.innerHTML = `
        <span>
          <b>Chương ${c.soChuong}:</b> ${c.tieuDe}
        </span>

        ${
          // Chỉ hiện nút sửa / xoá khi có quyền
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

      // Click vào chương chuyển sang trang đọc chương
      div.onclick = () => {
        location.href = `/Html/chuong.html?truyen=${truyen._id}&chuong=${c.soChuong}`;
      };

      // Thêm chương vào danh sách
      box.appendChild(div);
    });
}
