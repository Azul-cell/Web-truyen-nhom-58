// 🌐 TRUYỆN ĐANG XEM (global)
window.truyenHienTai = null;

/* =================================================
   LOAD CHI TIẾT TRUYỆN
================================================= */
async function loadChiTiet() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Không có ID truyện");
    return;
  }

  try {
    const res = await fetch(`/api/truyen/${id}`);
    if (!res.ok) throw new Error("Không load được truyện");

    const truyen = await res.json();
    window.truyenHienTai = truyen;

    /* ===== HIỂN THỊ THÔNG TIN ===== */
    document.getElementById("cover").src = truyen.anhBia || "/img/default.jpg";

    document.getElementById("title").textContent = truyen.tenTruyen;
    document.getElementById("author").textContent =
      "Tác giả: " + (truyen.tacGia || "Đang cập nhật");

    document.getElementById("genre").textContent =
      "Thể loại: " + (truyen.theLoai?.join(", ") || "Khác");

    document.getElementById("desc").textContent =
      truyen.moTa || "Chưa có mô tả";

    /* ===== DANH SÁCH CHƯƠNG ===== */
    if (typeof renderChuong === "function") {
      renderChuong(truyen.chuong || [], truyen._id);
    }

    /* ===== CHECK ADMIN ===== */
    if (typeof checkAdmin === "function") {
      checkAdmin();
    }

    /* ===== LOAD BÌNH LUẬN ===== */
    if (typeof loadBinhLuan === "function") {
      loadBinhLuan();
    }

    /* 🔥🔥🔥 LƯU LỊCH SỬ XEM (ĐÚNG CHỖ) */
    fetch(`/api/history/${truyen._id}`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error(err);
    alert("Lỗi load chi tiết truyện");
  }
}

/* =================================================
   KHỞI ĐỘNG
================================================= */
document.addEventListener("DOMContentLoaded", loadChiTiet);
