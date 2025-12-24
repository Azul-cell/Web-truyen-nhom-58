let stars = [];
const ratingAvg = document.getElementById("ratingAvg");

/* =================================================
   RENDER SAO (★ / ☆)
================================================= */
function renderStars(soSao) {
  stars.forEach((s) => {
    const val = Number(s.dataset.star);
    s.textContent = val <= soSao ? "★" : "☆";
  });
}

/* =================================================
   LOAD ĐIỂM TRUNG BÌNH
================================================= */
async function loadRatingAvg() {
  if (!window.truyenHienTai?._id) return;

  try {
    const res = await fetch(`/api/danhgia/${truyenHienTai._id}`);
    if (!res.ok) return;

    const data = await res.json();
    ratingAvg.textContent = `⭐ ${data.avg} / 5 (${data.count} lượt)`;
  } catch (err) {
    console.error("Load rating avg error:", err);
  }
}

/* =================================================
   LOAD SAO CỦA USER HIỆN TẠI
================================================= */
async function loadMyRating() {
  if (!window.truyenHienTai?._id) return;

  try {
    const res = await fetch(`/api/danhgia/${truyenHienTai._id}/me`, {
      credentials: "same-origin",
    });

    // ❌ chưa đăng nhập
    if (!res.ok) {
      renderStars(0);
      return;
    }

    const data = await res.json();
    renderStars(data.soSao || 0);
  } catch (err) {
    console.error("Load my rating error:", err);
  }
}

/* =================================================
   CLICK SAO
================================================= */
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

        // ❌ chưa đăng nhập hoặc lỗi
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

/* =================================================
   INIT
================================================= */
document.addEventListener("DOMContentLoaded", () => {
  stars = document.querySelectorAll("#ratingStars span");
  bindStarEvents();

  // Đợi truyenHienTai được load (từ file khác)
  const wait = setInterval(() => {
    if (window.truyenHienTai?._id) {
      loadRatingAvg();
      loadMyRating();
      clearInterval(wait);
    }
  }, 100);
});
