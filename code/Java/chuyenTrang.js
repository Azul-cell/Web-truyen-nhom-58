const soTruyen = 24; //khai báo số truyện trong 1 trang
const truyen = document.querySelectorAll(".truyen"); // //khai báo truyen tương ứng với class = truyen
const soTrang = Math.ceil(truyen.length / soTruyen); //soTrang = số nguyên làm tròn lên của số lượng truyện chia số truyện trong trang
const phanTrang = document.getElementById("phanTrang"); //khai báo id phanTrang

let trangHienTai = 1; //tạo biến trang hiện tại người dùng dang xem
const maxButtons = 5; //giới hạn số nút hiển thị
//tạo hàm trangHienThi
function trangHienThi(trang) {
  if (trang < 1) trang = 1; //nếu trang được truyền vào nhỏ hơn 1 thì = 1
  if (trang > soTrang) trang = soTrang; //nếu trang lớn hơn soTrang tối đa thì biến trang = soTrang

  trangHienTai = trang; //đổi trang đang xem = trang

  // Hiển thị truyện theo trang
  //.forEach lặp qua từng phần tử trong array của truyen và thực hiện một hành động
  truyen.forEach((item, i) => {
    item.style.display = //thay đổi kiểu hiển thị
      i >= (trang - 1) * soTruyen && i < trang * soTruyen ? "block" : "none";
  }); //biểu thức điều kiện trả "block" nếu item thuộc trang hiện tại, ngược lại "none" để ẩn.

  renderButtons(); // luôn cập nhật lại nút phân trang
}

function renderButtons() {
  phanTrang.innerHTML = ""; // xoá nút cũ

  // === PREV ===
  const prev = document.createElement("button"); //tạo element nút trong html
  prev.textContent = "Prev";
  prev.disabled = trangHienTai === 1; //tắt nếu trang bằng 1
  prev.addEventListener("click", () => trangHienThi(trangHienTai - 1));
  phanTrang.appendChild(prev); //thêm phần tử prev vào phanTrang

  // === TÍNH SỐ NÚT TỐI ĐA ===
  let start = Math.max(1, trangHienTai - Math.floor(maxButtons / 2)); //nút bắt đầu
  let end = start + maxButtons - 1; //nút cuối
  //nếu trang đang xem về gần cuối sẽ tăng nút start
  if (end > soTrang) {
    end = soTrang;
    start = Math.max(1, end - maxButtons + 1);
  }

  // === "..." phía trước ===
  if (start > 1) {
    const dotStart = document.createElement("button");
    dotStart.textContent = "...";
    dotStart.disabled = true; //khiến nút không nhấn được
    phanTrang.appendChild(dotStart);
  }

  // === NÚT SỐ TRANG ===
  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("page"); //khi tạo nút trang thêm class page

    if (i === trangHienTai) btn.classList.add("active"); //nếu i = trang hiện tại => thêm class active

    btn.addEventListener("click", () => trangHienThi(i)); // hiển thị khi nhấn số trang tương ứng
    phanTrang.appendChild(btn);
  }

  // === "..." phía sau ===
  if (end < soTrang) {
    const dotEnd = document.createElement("button");
    dotEnd.textContent = "...";
    dotEnd.disabled = true;
    phanTrang.appendChild(dotEnd);
  }

  // === NEXT ===
  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = trangHienTai === soTrang;
  next.addEventListener("click", () => trangHienThi(trangHienTai + 1));
  phanTrang.appendChild(next);
}

// luôn hiển thị trang 1
trangHienThi(1);
