const followList = document.getElementById("followList");

async function loadTheoDoi() {
  try {
    /* ===== CHECK LOGIN ===== */
    const resMe = await fetch("/api/me", { credentials: "include" });

    if (!resMe.ok) {
      followList.innerHTML = `
        <p style="color:#ffcc00">
          Vui lòng đăng nhập để xem truyện theo dõi
        </p>
      `;
      return;
    }

    /* ===== LOAD FOLLOWING ===== */
    const res = await fetch("/api/follow", {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Load theo dõi thất bại");
    }

    const ds = await res.json();
    followList.innerHTML = "";

    if (!ds || ds.length === 0) {
      followList.innerHTML = `
        <p style="color:#aaa">Bạn chưa theo dõi truyện nào</p>
      `;
      return;
    }

    /* ===== RENDER ===== */
    ds.forEach((truyen) => {
      const div = document.createElement("div");
      div.className = "itemTruyen";

      const lastChuong =
        truyen.chuong?.length > 0
          ? `Chương ${truyen.chuong[truyen.chuong.length - 1].soChuong}`
          : "Chưa có chương";

      div.innerHTML = `
        <img src="${truyen.anhBia || "/img/default.jpg"}">
        <div class="ten">${truyen.tenTruyen}</div>
        <div class="chapter">${lastChuong}</div>
      `;

      div.onclick = () => {
        location.href = `/Html/truyen.html?id=${truyen._id}`;
      };

      followList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    followList.innerHTML = `
      <p style="color:red">❌ Lỗi tải danh sách theo dõi</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadTheoDoi);
