// 🌐 TRUYỆN ĐANG XEM
window.truyenHienTai = null;

// 🌐 USER ĐANG ĐĂNG NHẬP
window.currentUser = null;

/* =================================================
   LOAD CHI TIẾT TRUYỆN
================================================= */
async function loadChiTiet() {
  const params = new URLSearchParams(window.location.search);
  const truyenId = params.get("id");
  if (!truyenId) return alert("Thiếu ID truyện");

  /* ===== LOAD USER ===== */
  try {
    const meRes = await fetch("/api/me", { credentials: "include" });
    if (meRes.ok) {
      window.currentUser = await meRes.json();
      console.log("USER:", window.currentUser);
    }
  } catch {
    window.currentUser = null;
  }

  /* ===== LOAD TRUYỆN ===== */
  const res = await fetch(`/api/truyen/${truyenId}`);
  if (!res.ok) return alert("Không load được truyện");

  const truyen = await res.json();
  window.truyenHienTai = truyen;

  console.log("TRUYEN:", truyen);

  /* ===== HIỂN THỊ ===== */
  document.getElementById("cover").src = truyen.anhBia || "/img/default.jpg";
  document.getElementById("title").textContent = truyen.tenTruyen;
  document.getElementById("author").textContent = "Tác giả: " + truyen.tacGia;
  document.getElementById("genre").textContent =
    "Thể loại: " + (truyen.theLoai?.join(", ") || "");
  document.getElementById("desc").textContent = truyen.moTa || "";

  renderChuong(truyen.chuong || [], truyen._id);
}

/* =================================================
   RENDER DANH SÁCH CHƯƠNG
================================================= */
function renderChuong(dsChuong, truyenId) {
  const box = document.getElementById("chuongList");
  box.innerHTML = "";

  if (!dsChuong.length) {
    box.innerHTML = "<p>Truyện chưa có chương</p>";
    return;
  }

  const user = window.currentUser;

  const isAdmin = user && user.capBac === 2;

  const isOwner =
    user &&
    window.truyenHienTai &&
    String(window.truyenHienTai.tacGiaId) === String(user._id);

  const coQuyen = isAdmin || isOwner;

  console.log("ADMIN:", isAdmin);
  console.log("OWNER:", isOwner);
  console.log("CO QUYEN:", coQuyen);

  dsChuong
    .sort((a, b) => a.soChuong - b.soChuong)
    .forEach((c) => {
      const div = document.createElement("div");
      div.className = "chuong-item";

      div.innerHTML = `
        <span>
          <b>Chương ${c.soChuong}:</b> ${c.tieuDe}
        </span>

        ${
          coQuyen
            ? `
          <span class="chuong-tools">
            <button onclick="chonSuaChuong(${c.soChuong}); event.stopPropagation()">✏️</button>
            <button onclick="xoaChuong(${c.soChuong}); event.stopPropagation()">🗑️</button>
          </span>
        `
            : ""
        }
      `;

      div.onclick = () => {
        location.href = `/Html/chuong.html?truyen=${truyenId}&chuong=${c.soChuong}`;
      };

      box.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", loadChiTiet);
