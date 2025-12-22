let stars = [];
const ratingAvg = document.getElementById("ratingAvg");

/* ================= RENDER SAO ================= */
function renderStars(soSao) {
  stars.forEach((s) => {
    const val = Number(s.dataset.star);
    s.textContent = val <= soSao ? "★" : "☆";
  });
}

/* ================= LOAD AVG ================= */
async function loadRatingAvg() {
  if (!window.truyenHienTai?._id) return;

  const res = await fetch(`/api/danhgia/${truyenHienTai._id}`);
  const data = await res.json();

  ratingAvg.textContent = `⭐ ${data.avg} / 5 (${data.count} lượt)`;
}

/* ================= LOAD SAO USER ================= */
async function loadMyRating() {
  const res = await fetch(`/api/danhgia/${truyenHienTai._id}/me`, {
    credentials: "include",
  });

  const data = await res.json();
  renderStars(data.soSao || 0);
}

/* ================= CLICK ================= */
function bindStarEvents() {
  stars.forEach((star) => {
    star.onclick = async () => {
      const soSao = Number(star.dataset.star);

      const res = await fetch(`/api/danhgia/${truyenHienTai._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ soSao }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      renderStars(soSao);
      loadRatingAvg();
    };
  });
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  stars = document.querySelectorAll("#ratingStars span");
  bindStarEvents();

  const wait = setInterval(() => {
    if (window.truyenHienTai?._id) {
      loadRatingAvg();
      loadMyRating();
      clearInterval(wait);
    }
  }, 100);
});
