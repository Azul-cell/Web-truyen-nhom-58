async function loadChuong() {
  const params = new URLSearchParams(window.location.search);
  const truyenId = params.get("truyen");
  const soChuong = Number(params.get("chuong"));

  if (!truyenId || !soChuong) {
    document.body.innerHTML = "<h2>Thiếu thông tin chương</h2>";
    return;
  }

  const res = await fetch(`/api/truyen/${truyenId}`);
  if (!res.ok) return;

  const truyen = await res.json();
  const dsChuong = truyen.chuong || [];

  const chuong = dsChuong.find((c) => c.soChuong === soChuong);
  if (!chuong) {
    document.body.innerHTML = "<h2>Không tìm thấy chương</h2>";
    return;
  }

  // Title
  document.getElementById(
    "chuongTitle"
  ).textContent = `${truyen.tenTruyen} – Chương ${chuong.soChuong}: ${chuong.tieuDe}`;

  // Nội dung (tách dòng)
  const content = document.getElementById("chuongContent");
  content.innerHTML = "";

  chuong.noiDung.split("\n").forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    content.appendChild(p);
  });

  // Nút quay lại truyện
  document.getElementById(
    "backTruyen"
  ).href = `/Html/truyen.html?id=${truyenId}`;

  // Prev / Next
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = soChuong <= 1;
  nextBtn.disabled = soChuong >= dsChuong.length;

  prevBtn.onclick = () => {
    location.href = `/Html/chuong.html?truyen=${truyenId}&chuong=${
      soChuong - 1
    }`;
  };

  nextBtn.onclick = () => {
    location.href = `/Html/chuong.html?truyen=${truyenId}&chuong=${
      soChuong + 1
    }`;
  };
}

loadChuong();
