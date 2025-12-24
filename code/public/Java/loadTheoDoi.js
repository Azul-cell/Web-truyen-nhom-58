async function loadTheoDoi() {
  const followList = document.getElementById("followList");

  try {
    const res = await fetch("/api/following", {
      credentials: "include",
    });

    // ❌ chưa đăng nhập
    if (res.status === 401) {
      followList.innerHTML = `
        <p style="color:#ffcc00">
          Vui lòng đăng nhập để xem truyện theo dõi
        </p>`;
      return;
    }

    const data = await res.json();

    // ❌ không theo dõi truyện nào
    if (!data || data.length === 0) {
      followList.innerHTML = `
        <p style="color:#aaa">Bạn chưa theo dõi truyện nào</p>`;
      return;
    }

    followList.innerHTML = "";

    data.forEach((truyen) => {
      const div = document.createElement("div");
      div.className = "itemTruyen";

      // 🔥 lấy chương mới nhất
      const lastChuong =
        truyen.chuong?.length > 0
          ? `Chương ${truyen.chuong[truyen.chuong.length - 1].soChuong}`
          : "Chưa có chương";

      div.innerHTML = `
        <img src="${truyen.anhBia || "/img/default.jpg"}">
        <div class="ten">${truyen.tenTruyen}</div>
        <div class="chapter">
          ✍ ${truyen.tacGia || "Đang cập nhật"}<br>
          📖 ${lastChuong}
        </div>
      `;

      // click → chi tiết truyện
      div.onclick = () => {
        location.href = `/Html/chiTiet.html?id=${truyen._id}`;
      };

      followList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    followList.innerHTML = `
      <p style="color:red">Lỗi tải danh sách theo dõi</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadTheoDoi);
