//LOAD DANH SÁCH TRUYỆN ĐANG THEO DÕI

async function loadTheoDoi() {
  // Thẻ HTML chứa danh sách truyện theo dõi
  const followList = document.getElementById("followList");

  try {
    // Gửi request lên server để lấy danh sách theo dõi
    const res = await fetch("/api/following", {
      credentials: "include", // gửi cookie để xác thực user
    });

    /* ---------- CHƯA ĐĂNG NHẬP ---------- */
    if (res.status === 401) {
      followList.innerHTML = `
        <p style="color:#ffcc00">
          Vui lòng đăng nhập để xem truyện theo dõi
        </p>`;
      return;
    }

    // Parse dữ liệu JSON
    const data = await res.json();

    /* ---------- CHƯA THEO DÕI TRUYỆN ---------- */
    if (!data || data.length === 0) {
      followList.innerHTML = `
        <p style="color:#aaa">Bạn chưa theo dõi truyện nào</p>`;
      return;
    }

    // Xóa nội dung cũ
    followList.innerHTML = "";

    /* ---------- RENDER DANH SÁCH TRUYỆN ---------- */
    data.forEach((truyen) => {
      const div = document.createElement("div");
      div.className = "itemTruyen";

      // Lấy chương mới nhất của truyện
      const lastChuong =
        truyen.chuong?.length > 0
          ? `Chương ${truyen.chuong[truyen.chuong.length - 1].soChuong}`
          : "Chưa có chương";

      // Nội dung hiển thị
      div.innerHTML = `
        <img src="${truyen.anhBia || "/img/default.jpg"}">
        <div class="ten">${truyen.tenTruyen}</div>
        <div class="chapter">
          ✍ ${truyen.tacGia || "Đang cập nhật"}<br>
          📖 ${lastChuong}
        </div>
      `;

      // Click vào truyện → chuyển sang trang chi tiết
      div.onclick = () => {
        location.href = `/Html/chiTiet.html?id=${truyen._id}`;
      };

      // Thêm truyện vào danh sách
      followList.appendChild(div);
    });
  } catch (err) {
    // Lỗi mạng / server
    console.error(err);
    followList.innerHTML = `
      <p style="color:red">Lỗi tải danh sách theo dõi</p>`;
  }
}

//Tự động load danh sách theo dõi khi trang load
document.addEventListener("DOMContentLoaded", loadTheoDoi);
