//LOAD + LƯU LỊCH SỬ ĐỌC TRUYỆN

// Khung hiển thị danh sách lịch sử đọc
const historyList = document.getElementById("historyList");

//LOAD LỊCH SỬ ĐỌC TỪ SERVER
async function loadHistory() {
  // Không có khung hiển thị thì dừng
  if (!historyList) return;

  try {
    // Gọi API lấy lịch sử đọc của user
    const res = await fetch("/api/history", {
      credentials: "include", // gửi cookie đăng nhập
    });

    // Chưa đăng nhập
    if (!res.ok) {
      historyList.innerHTML = "<p>Vui lòng đăng nhập để xem lịch sử đọc</p>";
      return;
    }

    const ds = await res.json();
    historyList.innerHTML = "";

    // Không có dữ liệu lịch sử
    if (!Array.isArray(ds) || ds.length === 0) {
      historyList.innerHTML = "<p>Chưa có lịch sử đọc</p>";
      return;
    }

    // Sắp xếp lịch sử theo thời gian đọc mới nhất
    ds.sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));

    // Render từng truyện trong lịch sử
    ds.forEach((truyen) => {
      if (!truyen || !truyen._id) return;

      const div = document.createElement("div");
      div.className = "itemTruyen";

      div.innerHTML = `
        <img src="${truyen.anhBia || "/img/default.jpg"}" />
        <div class="ten">${truyen.tenTruyen || "Không tên"}</div>
        <div class="chapter">⏱ ${
          truyen.lastReadAt ? new Date(truyen.lastReadAt).toLocaleString() : ""
        }</div>
      `;

      // Click → mở lại trang truyện
      div.onclick = () => {
        location.href = `/Html/truyen.html?id=${truyen._id}`;
      };

      historyList.appendChild(div);
    });
  } catch (err) {
    console.error("Load history error:", err);
    historyList.innerHTML = "<p>Lỗi tải lịch sử</p>";
  }
}

//LƯU LỊCH SỬ ĐỌC
async function saveHistory(truyenId) {
  if (!truyenId) return;

  try {
    // Gửi yêu cầu lưu lịch sử đọc
    await fetch(`/api/history/${truyenId}`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Lưu lịch sử lỗi:", err);
  }
}

//KHỞI TẠO
document.addEventListener("DOMContentLoaded", () => {
  // Load lịch sử khi vào trang
  loadHistory();

  // Nếu đang ở trang truyen.html → tự động lưu lịch sử
  const params = new URLSearchParams(window.location.search);
  const truyenId = params.get("id");

  if (truyenId) {
    // Lưu xong → load lại lịch sử cho mới
    saveHistory(truyenId).then(() => loadHistory());
  }
});
