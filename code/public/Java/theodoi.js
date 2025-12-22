const followList = document.getElementById("followList");

async function loadTheoDoi() {
  const resMe = await fetch("/api/me", { credentials: "include" });
  const user = await resMe.json();

  if (!user) {
    alert("Bạn cần đăng nhập");
    location.href = "/Html/login.html";
    return;
  }

  const res = await fetch("/api/follow", { credentials: "include" });
  const ds = await res.json();

  followList.innerHTML = "";

  if (!ds || ds.length === 0) {
    followList.innerHTML = "<p>Bạn chưa theo dõi truyện nào</p>";
    return;
  }

  ds.forEach((truyen) => {
    const div = document.createElement("div");
    div.className = "truyen";

    div.innerHTML = `
      <img src="${truyen.anhBia || "/img/default.jpg"}" alt="${
      truyen.tenTruyen
    }">
      <div class="ten">${truyen.tenTruyen}</div>
      <div class="chapter">
        ${
          truyen.chuong?.length
            ? "Chương " + truyen.chuong[truyen.chuong.length - 1].soChuong
            : "Chưa có chương"
        }
      </div>
    `;

    div.onclick = () => {
      location.href = "/Html/truyen.html?id=" + truyen._id;
    };

    followList.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", loadTheoDoi);
