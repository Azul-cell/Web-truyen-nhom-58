// Thẻ chứa danh sách truyện đang theo dõi
const followList = document.getElementById("followList");

// ================= LOAD DANH SÁCH THEO DÕI =================
async function loadTheoDoi() {
  try {
    // ===== KIỂM TRA ĐĂNG NHẬP =====
    const resMe = await fetch("/api/me", { credentials: "include" });

    // Chưa đăng nhập
    if (!resMe.ok) {
      followList.innerHTML = `
        <p style="color:#ffcc00">
          Vui lòng đăng nhập để xem truyện theo dõi
        </p>
      `;
      return;
    }

    // ===== LẤY DANH SÁCH TRUYỆN ĐANG THEO DÕI =====
    const res = await fetch("/api/follow", {
      credentials: "include",
    });

    // Lỗi khi gọi API
    if (!res.ok) {
      throw new Error("Load theo dõi thất bại");
    }

    const ds = await res.json();
    followList.innerHTML = "";

    // Không có truyện theo dõi
    if (!ds || ds.length === 0) {
      followList.innerHTML = `
        <p style="color:#aaa">Bạn chưa theo dõi truyện nào</p>
      `;
      return;
    }

    // ===== HIỂN THỊ DANH SÁCH =====
    ds.forEach((truyen) => {
      const div = document.createElement("div");
      div.className = "itemTruyen";

      // Lấy chương mới nhất
      const lastChuong =
        truyen.chuong?.length > 0
          ? `Chương ${truyen.chuong[truyen.chuong.length - 1].soChuong}`
          : "Chưa có chương";

      // Nội dung hiển thị truyện
      div.innerHTML = `
        <img src="${truyen.anhBia || "/img/default.jpg"}">
        <div class="ten">${truyen.tenTruyen}</div>
        <div class="chapter">${lastChuong}</div>
      `;

      // Click → chuyển sang trang truyện
      div.onclick = () => {
        location.href = `/Html/truyen.html?id=${truyen._id}`;
      };

      followList.appendChild(div);
    });
  } catch (err) {
    // Bắt lỗi khi load danh sách
    console.error(err);
    followList.innerHTML = `
      <p style="color:red">Lỗi tải danh sách theo dõi</p>
    `;
  }
}

// Load danh sách theo dõi khi mở trang
document.addEventListener("DOMContentLoaded", loadTheoDoi);
