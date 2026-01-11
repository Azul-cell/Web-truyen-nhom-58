//LOAD TRUYỆN ĐỀ CỬ (FEATURED)

async function loadFeatured() {
  // Lấy thẻ HTML chứa danh sách truyện đề cử
  const box = document.getElementById("listFeatured");

  // Nếu không tồn tại box thì không làm gì
  if (!box) return;

  try {
    // Gửi request lên server để lấy truyện đề cử
    const res = await fetch("/api/decu");

    // Server trả lỗi
    if (!res.ok) {
      box.innerHTML = "<p>Không tải được truyện đề cử</p>";
      return;
    }

    // Parse dữ liệu JSON
    const data = await res.json();

    // Xóa nội dung cũ trước khi render
    box.innerHTML = "";

    // Không có dữ liệu hoặc danh sách rỗng
    if (!Array.isArray(data) || data.length === 0) {
      box.innerHTML = "<p>Chưa có truyện đề cử</p>";
      return;
    }

    // Duyệt từng truyện đề cử
    data.forEach((t) => {
      // Kiểm tra dữ liệu hợp lệ
      if (!t || !t._id) return;

      // Tạo thẻ chứa thông tin truyện
      const div = document.createElement("div");

      // itemTruyen: style card truyện
      // tag-wrapper: hỗ trợ hiển thị nhãn (CSS)
      div.className = "itemTruyen tag-wrapper";

      // Nội dung truyện
      div.innerHTML = `
        <img src="${t.anhBia || "/img/default.jpg"}" />
        <div class="ten">${t.tenTruyen || "Không tên"}</div>
        <div class="chapter">
          Tác giả: ${t.tacGia || "Đang cập nhật"}
        </div>
      `;

      // Click vào truyện → chuyển sang trang chi tiết
      div.onclick = () => {
        location.href = "/Html/truyen.html?id=" + t._id;
      };

      // Thêm truyện vào danh sách
      box.appendChild(div);
    });
  } catch (err) {
    // Lỗi mạng / server không phản hồi
    console.error("Lỗi load đề cử:", err);
    box.innerHTML = "<p>Lỗi kết nối server</p>";
  }
}

//Tự động load truyện đề cử khi trang web load xong
document.addEventListener("DOMContentLoaded", loadFeatured);
