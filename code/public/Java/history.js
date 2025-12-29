/* =================================================
   LOAD LỊCH SỬ ĐỌC TRUYỆN
================================================= */

const historyList = document.getElementById("historyList");

/* =================================================
   FETCH + RENDER
================================================= */
async function loadHistory() {
  if (!historyList) return;

  try {
    const res = await fetch("/api/history", {
      credentials: "same-origin",
    });

    /* ---------- CHƯA ĐĂNG NHẬP ---------- */
    if (!res.ok) {
      historyList.innerHTML = "<p>🔒 Vui lòng đăng nhập để xem lịch sử đọc</p>";
      return;
    }

    let ds;
    try {
      ds = await res.json();
    } catch {
      historyList.innerHTML = "<p>❌ Dữ liệu lịch sử không hợp lệ</p>";
      return;
    }

    historyList.innerHTML = "";

    /* ---------- KHÔNG CÓ LỊCH SỬ ---------- */
    if (!Array.isArray(ds) || ds.length === 0) {
      historyList.innerHTML = "<p>📭 Chưa có lịch sử đọc</p>";
      return;
    }

    /* ---------- SẮP XẾP THEO THỜI GIAN ---------- */
    ds.sort(
      (a, b) => new Date(b.lastReadAt || 0) - new Date(a.lastReadAt || 0)
    );

    /* ---------- RENDER ---------- */
    ds.forEach((truyen) => {
      if (!truyen || !truyen._id) return;

      const div = document.createElement("div");
      div.className = "itemTruyen";

      div.innerHTML = `
        <img src="${truyen.anhBia || "/img/default.jpg"}" />
        <div class="ten">${truyen.tenTruyen || "Không tên"}</div>
        <div class="chapter">
          ⏱ ${
            truyen.lastReadAt
              ? new Date(truyen.lastReadAt).toLocaleString()
              : ""
          }
        </div>
      `;

      // Click → quay lại trang truyện
      div.onclick = () => {
        location.href = `/Html/truyen.html?id=${truyen._id}`;
      };

      historyList.appendChild(div);
    });
  } catch (err) {
    console.error("Load history error:", err);
    historyList.innerHTML = "<p>❌ Lỗi tải lịch sử</p>";
  }
}

/* =================================================
  INIT
================================================= */
document.addEventListener("DOMContentLoaded", loadHistory);
