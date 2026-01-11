/* =================================================
   LOAD CHI TIẾT CHƯƠNG TRUYỆN
   - Lấy ID truyện & số chương từ URL
   - Gọi API lấy dữ liệu truyện
   - Hiển thị nội dung chương
   - Xử lý chương trước / sau
   - Lưu lịch sử đọc
================================================= */
async function loadChuong() {
  /* ===== LẤY THAM SỐ TRÊN URL ===== */
  const params = new URLSearchParams(window.location.search);
  const truyenId = params.get("truyen"); // ID truyện
  const soChuong = Number(params.get("chuong")); // Số chương

  /* ===== KIỂM TRA URL ===== */
  if (!truyenId || !soChuong) {
    document.body.innerHTML = "<h2>Thiếu thông tin chương</h2>";
    return;
  }

  /* ===== LẤY DỮ LIỆU TRUYỆN TỪ SERVER ===== */
  let truyen;
  try {
    const res = await fetch(`/api/truyen/${truyenId}`, {
      credentials: "same-origin", // gửi cookie đăng nhập
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

  /* ===== LẤY DANH SÁCH CHƯƠNG ===== */
  const dsChuong = truyen.chuong || [];

  /* ===== TÌM CHƯƠNG ĐANG ĐỌC ===== */
  const chuong = dsChuong.find((c) => c.soChuong === soChuong);
  if (!chuong) {
    document.body.innerHTML = "<h2>Không tìm thấy chương</h2>";
    return;
  }

  /* ===== HIỂN THỊ TIÊU ĐỀ CHƯƠNG ===== */
  document.getElementById(
    "chuongTitle"
  ).textContent = `${truyen.tenTruyen} – Chương ${chuong.soChuong}: ${chuong.tieuDe}`;

  /* ===== HIỂN THỊ NỘI DUNG CHƯƠNG ===== */
  const content = document.getElementById("chuongContent");
  content.innerHTML = "";

  // Tách nội dung theo dòng và bọc mỗi dòng bằng <p>
  chuong.noiDung.split("\n").forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    content.appendChild(p);
  });

  /* ===== NÚT QUAY LẠI TRANG TRUYỆN ===== */
  document.getElementById(
    "backTruyen"
  ).href = `/Html/truyen.html?id=${truyenId}`;

  /* ===== XỬ LÝ CHƯƠNG TRƯỚC / SAU ===== */
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Danh sách số chương thực tế (đã sắp xếp)
  const soChuongList = dsChuong.map((c) => c.soChuong).sort((a, b) => a - b);

  const index = soChuongList.indexOf(soChuong);

  /* --- CHƯƠNG TRƯỚC --- */
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

  /* --- CHƯƠNG SAU --- */
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
}

/* ===== GỌI HÀM KHI LOAD TRANG ===== */
loadChuong();
