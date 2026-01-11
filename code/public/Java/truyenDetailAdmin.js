//BIẾN TOÀN CỤC

// Lưu số chương đang được chỉnh sửa (null = không sửa)
let chuongDangSua = null;

//DOM ELEMENT
// Box quản lý chương (chỉ hiện cho tác giả / admin)
const adminBox = document.getElementById("adminChuongBox");

// Input nhập chương
const soChuongInput = document.getElementById("soChuong");
const tieuDeInput = document.getElementById("tieuDeChuong");
const noiDungInput = document.getElementById("noiDungChuong");

// Các nút chức năng
const btnThem = document.getElementById("btnThemChuong");
const btnCapNhat = document.getElementById("btnCapNhatChuong");
const btnHuy = document.getElementById("btnHuySua");

//CHECK CẤP BẬC USER
//capBac >= 1 → được thêm / sửa / xoá chương
async function checkCapBac() {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    if (!res.ok) return;

    const user = await res.json();

    // Nếu là tác giả hoặc admin → hiện box quản lý chương
    if (user && user.capBac >= 1) {
      adminBox.style.display = "block";
    }
  } catch (err) {
    console.error("Check cấp bậc lỗi", err);
  }
}

// Tự động kiểm tra khi load trang
document.addEventListener("DOMContentLoaded", checkCapBac);

//THÊM CHƯƠNG MỚI
btnThem.onclick = async () => {
  const soChuong = Number(soChuongInput.value);
  const tieuDe = tieuDeInput.value.trim();
  const noiDung = noiDungInput.value.trim();

  // Kiểm tra dữ liệu
  if (!soChuong || !tieuDe || !noiDung) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  // Gửi request thêm chương
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
  loadChiTiet(); // load lại danh sách chương
};

//CHỌN CHƯƠNG ĐỂ SỬA
function chonSuaChuong(soChuong) {
  // Chưa load dữ liệu truyện
  if (!truyenHienTai || !Array.isArray(truyenHienTai.chuong)) {
    alert("Dữ liệu chưa sẵn sàng");
    return;
  }

  // Tìm chương cần sửa
  const chuong = truyenHienTai.chuong.find(
    (c) => c.soChuong === Number(soChuong)
  );

  if (!chuong) {
    alert("Không tìm thấy chương");
    return;
  }

  // Lưu trạng thái đang sửa
  chuongDangSua = chuong.soChuong;

  // Đổ dữ liệu lên form
  soChuongInput.value = chuong.soChuong;
  soChuongInput.disabled = true; // không cho đổi số chương
  tieuDeInput.value = chuong.tieuDe;
  noiDungInput.value = chuong.noiDung;

  // Đổi nút
  btnThem.style.display = "none";
  btnCapNhat.style.display = "inline-block";
  btnHuy.style.display = "inline-block";
}

//CẬP NHẬT CHƯƠNG
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

  // Gửi request cập nhật
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

//XOÁ CHƯƠNG
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

//RESET FORM (HUỶ SỬA / SAU KHI THÊM XONG)
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
