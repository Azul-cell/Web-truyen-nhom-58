let stars = [];
const ratingAvg = document.getElementById("ratingAvg");

// Hiển thị sao theo số sao truyền vào
function renderStars(soSao) {
  stars.forEach((s) => {
    const val = Number(s.dataset.star);
    s.textContent = val <= soSao ? "★" : "☆";
  });
}

// Lấy điểm trung bình và số lượt đánh giá của truyện
async function loadRatingAvg() {
  if (!window.truyenHienTai?._id) return;

  try {
    const res = await fetch(`/api/danhgia/${truyenHienTai._id}`);
    if (!res.ok) return;

    const data = await res.json();
    ratingAvg.textContent = `⭐ ${data.avg} / 5 (${data.count} lượt)`;
  } catch (err) {
    console.error("Lỗi lấy điểm trung bình:", err);
  }
}

// Lấy số sao mà người dùng hiện tại đã đánh giá
async function loadMyRating() {
  if (!window.truyenHienTai?._id) return;

  try {
    const res = await fetch(`/api/danhgia/${truyenHienTai._id}/me`, {
      credentials: "same-origin",
    });

    // Chưa đăng nhập
    if (!res.ok) {
      renderStars(0);
      return;
    }

    const data = await res.json();
    renderStars(data.soSao || 0);
  } catch (err) {
    console.error("Lỗi lấy đánh giá cá nhân:", err);
  }
}

// Gắn sự kiện click cho từng sao
function bindStarEvents() {
  stars.forEach((star) => {
    star.onclick = async () => {
      if (!window.truyenHienTai?._id) return;

      const soSao = Number(star.dataset.star);

      try {
        const res = await fetch(`/api/danhgia/${truyenHienTai._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ soSao }),
        });

        const data = await res.json();

        // Chưa đăng nhập hoặc lỗi
        if (!res.ok) {
          alert(data.message || "Vui lòng đăng nhập để đánh giá");
          return;
        }

        renderStars(soSao);
        loadRatingAvg();
      } catch (err) {
        alert("Không gửi được đánh giá");
      }
    };
  });
}

// Khởi tạo chức năng đánh giá khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
  stars = document.querySelectorAll("#ratingStars span");
  bindStarEvents();

  // Đợi dữ liệu truyện được load
  const wait = setInterval(() => {
    if (window.truyenHienTai?._id) {
      loadRatingAvg();
      loadMyRating();
      clearInterval(wait);
    }
  }, 100);
});
