const historyList = document.getElementById("historyList");

/* ================= LOAD LỊCH SỬ ================= */
async function loadHistory() {
  try {
    const res = await fetch("/api/history", {
      credentials: "include",
    });

    const ds = await res.json();

    historyList.innerHTML = "";

    if (!ds || ds.length === 0) {
      historyList.innerHTML = "<p>📭 Chưa có lịch sử đọc</p>";
      return;
    }

    ds.forEach((truyen) => {
      const div = document.createElement("div");
      div.className = "itemTruyen";

      div.innerHTML = `
        <img src="${truyen.anhBia || "/img/default.jpg"}" />
        <div class="ten">${truyen.tenTruyen}</div>
        <div class="chapter">
          ⏱ ${new Date(truyen.lastReadAt).toLocaleString()}
        </div>
      `;

      // click → quay lại truyện
      div.onclick = () => {
        location.href = `/Html/truyen.html?id=${truyen._id}`;
      };

      historyList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    historyList.innerHTML = "<p>❌ Lỗi tải lịch sử</p>";
  }
}

/* ================= KHỞI ĐỘNG ================= */
document.addEventListener("DOMContentLoaded", loadHistory);
