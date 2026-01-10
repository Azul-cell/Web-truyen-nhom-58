/* =========================================
   history.js
   Load + Lưu lịch sử đọc
========================================= */

const historyList = document.getElementById("historyList");

//  Load lịch sử
async function loadHistory() {
  if (!historyList) return;

  try {
    const res = await fetch("/api/history", {
      credentials: "include",
    });

    if (!res.ok) {
      historyList.innerHTML = "<p>🔒 Vui lòng đăng nhập để xem lịch sử đọc</p>";
      return;
    }

    const ds = await res.json();
    historyList.innerHTML = "";

    if (!Array.isArray(ds) || ds.length === 0) {
      historyList.innerHTML = "<p>📭 Chưa có lịch sử đọc</p>";
      return;
    }

    // sắp xếp mới nhất
    ds.sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));

    // render
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

      div.onclick = () => {
        // mở trang truyện + lưu lịch sử
        location.href = `/Html/truyen.html?id=${truyen._id}`;
      };

      historyList.appendChild(div);
    });
  } catch (err) {
    console.error("Load history error:", err);
    historyList.innerHTML = "<p>❌ Lỗi tải lịch sử</p>";
  }
}

// Lưu lịch sử (gọi khi mở trang truyện)
async function saveHistory(truyenId) {
  if (!truyenId) return;
  try {
    await fetch(`/api/history/${truyenId}`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Lưu lịch sử lỗi:", err);
  }
}

//  INIT
document.addEventListener("DOMContentLoaded", () => {
  loadHistory();

  // nếu đang ở trang truyen.html, lưu lịch sử tự động
  const params = new URLSearchParams(window.location.search);
  const truyenId = params.get("id");
  if (truyenId) {
    saveHistory(truyenId).then(() => loadHistory()); // cập nhật lịch sử luôn
  }
});
