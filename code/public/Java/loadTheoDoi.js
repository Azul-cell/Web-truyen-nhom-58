async function loadTheoDoi() {
  const followList = document.getElementById("followList");

  try {
    const res = await fetch("/api/following", {
      credentials: "include",
    });

    // ❌ chưa đăng nhập
    if (res.status === 401) {
      followList.innerHTML = `
        <p style="color:#ffcc00">Vui lòng đăng nhập để xem truyện theo dõi</p>
      `;
      return;
    }

    const data = await res.json();

    // ❌ không theo dõi truyện nào
    if (!data || data.length === 0) {
      followList.innerHTML = `
        <p style="color:#aaa">Bạn chưa theo dõi truyện nào</p>
      `;
      return;
    }

    followList.innerHTML = "";

    data.forEach((truyen) => {
      const div = document.createElement("div");
      div.className = "truyen";

      div.innerHTML = `
        <img src="${truyen.cover || "/img/demo.jpg"}" alt="${truyen.title}">
        <div class="info">
          <h3 class="tenTruyen">${truyen.title}</h3>
          <p class="tacGia">${truyen.author || "Đang cập nhật"}</p>
          <p class="chuongMoi">
            Chương mới: ${truyen.lastChapter || "?"}
          </p>
        </div>
      `;

      // click vào truyện → trang chi tiết
      div.addEventListener("click", () => {
        window.location.href = `/Html/truyen.html?id=${truyen._id}`;
      });

      followList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    followList.innerHTML = `
      <p style="color:red">Lỗi tải danh sách theo dõi</p>
    `;
  }
}

// chạy khi load trang
document.addEventListener("DOMContentLoaded", loadTheoDoi);
