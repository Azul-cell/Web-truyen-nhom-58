/* =================================================
   LOAD CHI TIẾT CHƯƠNG TRUYỆN
================================================= */
async function loadChuong() {
  const params = new URLSearchParams(window.location.search);
  const truyenId = params.get("truyen");
  const soChuong = Number(params.get("chuong"));

  /* ---------- VALIDATE URL ---------- */
  if (!truyenId || !soChuong) {
    document.body.innerHTML = "<h2>Thiếu thông tin chương</h2>";
    return;
  }

  /* ---------- FETCH TRUYỆN ---------- */
  let truyen;
  try {
    const res = await fetch(`/api/truyen/${truyenId}`, {
      credentials: "same-origin",
    });

    if (!res.ok) {
      document.body.innerHTML = "<h2>Không tải được truyện</h2>";
      return;
    }

    truyen = await res.json();
  } catch (err) {
    document.body.innerHTML = "<h2>Lỗi kết nối server</h2>";
    return;
  }

  const dsChuong = truyen.chuong || [];

  /* ---------- TÌM CHƯƠNG ---------- */
  const chuong = dsChuong.find((c) => c.soChuong === soChuong);

  if (!chuong) {
    document.body.innerHTML = "<h2>Không tìm thấy chương</h2>";
    return;
  }

  /* ---------- HIỂN THỊ TIÊU ĐỀ ---------- */
  document.getElementById(
    "chuongTitle"
  ).textContent = `${truyen.tenTruyen} – Chương ${chuong.soChuong}: ${chuong.tieuDe}`;

  /* ---------- HIỂN THỊ NỘI DUNG ---------- */
  const content = document.getElementById("chuongContent");
  content.innerHTML = "";

  chuong.noiDung.split("\n").forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    content.appendChild(p);
  });

  /* ---------- NÚT QUAY LẠI TRUYỆN ---------- */
  document.getElementById(
    "backTruyen"
  ).href = `/Html/truyen.html?id=${truyenId}`;

  /* ---------- PREV / NEXT ---------- */

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Lấy danh sách số chương thực tế
  const soChuongList = dsChuong.map((c) => c.soChuong).sort((a, b) => a - b);
  const index = soChuongList.indexOf(soChuong);

  // Prev
  if (index <= 0) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
    prevBtn.onclick = () => {
      location.href = `/Html/chuong.html?truyen=${truyenId}&chuong=${
        soChuongList[index - 1]
      }`;
    };
  }

  // Next
  if (index === -1 || index >= soChuongList.length - 1) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
    nextBtn.onclick = () => {
      location.href = `/Html/chuong.html?truyen=${truyenId}&chuong=${
        soChuongList[index + 1]
      }`;
    };
  }

  /* ---------- GHI LỊCH SỬ ĐỌC ---------- */
  fetch("/api/user/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ truyenId }),
  }).catch(() => {});
}

/* ---------- GỌI HÀM ---------- */
loadChuong();
