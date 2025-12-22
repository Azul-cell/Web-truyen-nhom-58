/* =================================================
   BIẾN TOÀN CỤC
================================================= */
let chuongDangSua = null;

/* =================================================
   DOM ELEMENT
================================================= */
const adminBox = document.getElementById("adminChuongBox");

const soChuongInput = document.getElementById("soChuong");
const tieuDeInput = document.getElementById("tieuDeChuong");
const noiDungInput = document.getElementById("noiDungChuong");

const btnThem = document.getElementById("btnThemChuong");
const btnCapNhat = document.getElementById("btnCapNhatChuong");
const btnHuy = document.getElementById("btnHuySua");

/* =================================================
   CHECK ADMIN
================================================= */
async function checkAdmin() {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    if (!res.ok) return;

    const user = await res.json();
    if (user && user.role === "admin") {
      adminBox.style.display = "block";
    }
  } catch (err) {
    console.error("Check admin lỗi", err);
  }
}

/* =================================================
   THÊM CHƯƠNG
================================================= */
btnThem.onclick = async () => {
  const soChuong = Number(soChuongInput.value);
  const tieuDe = tieuDeInput.value.trim();
  const noiDung = noiDungInput.value.trim();

  if (!soChuong || !tieuDe || !noiDung) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  const res = await fetch(`/api/truyen/${truyenHienTai._id}/chuong`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ soChuong, tieuDe, noiDung }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message || "Thêm thất bại");

  alert(data.message);
  resetForm();
  loadChiTiet(); // reload lại danh sách
};

/* =================================================
   BẮT ĐẦU SỬA (CLICK ✏️)
================================================= */
function chonSuaChuong(soChuong) {
  if (!truyenHienTai || !Array.isArray(truyenHienTai.chuong)) {
    alert("Dữ liệu chưa sẵn sàng");
    return;
  }

  const chuong = truyenHienTai.chuong.find(
    (c) => c.soChuong === Number(soChuong)
  );

  if (!chuong) {
    alert("Không tìm thấy chương");
    return;
  }

  chuongDangSua = chuong.soChuong;

  soChuongInput.value = chuong.soChuong;
  soChuongInput.disabled = true;
  tieuDeInput.value = chuong.tieuDe;
  noiDungInput.value = chuong.noiDung;

  btnThem.style.display = "none";
  btnCapNhat.style.display = "inline-block";
  btnHuy.style.display = "inline-block";
}

/* =================================================
   CẬP NHẬT CHƯƠNG
================================================= */
btnCapNhat.onclick = async () => {
  if (chuongDangSua === null) {
    alert("Chưa chọn chương cần sửa");
    return;
  }

  const tieuDe = tieuDeInput.value.trim();
  const noiDung = noiDungInput.value.trim();

  if (!tieuDe || !noiDung) {
    alert("Thiếu dữ liệu cập nhật");
    return;
  }

  const res = await fetch(
    `/api/truyen/${truyenHienTai._id}/chuong/${chuongDangSua}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ tieuDe, noiDung }),
    }
  );

  const data = await res.json();
  if (!res.ok) return alert(data.message || "Cập nhật thất bại");

  alert(data.message);
  resetForm();
  loadChiTiet();
};

/* =================================================
   XOÁ CHƯƠNG
================================================= */
async function xoaChuong(soChuong) {
  if (!confirm("Bạn chắc chắn muốn xoá chương này?")) return;

  const res = await fetch(
    `/api/truyen/${truyenHienTai._id}/chuong/${soChuong}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await res.json();
  if (!res.ok) return alert(data.message || "Xoá thất bại");

  alert(data.message);
  loadChiTiet();
}

/* =================================================
   RESET FORM
================================================= */
btnHuy.onclick = resetForm;

function resetForm() {
  chuongDangSua = null;

  soChuongInput.disabled = false;
  soChuongInput.value = "";
  tieuDeInput.value = "";
  noiDungInput.value = "";

  btnThem.style.display = "inline-block";
  btnCapNhat.style.display = "none";
  btnHuy.style.display = "none";
}
