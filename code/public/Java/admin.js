async function addTruyen() {
  const tenTruyen = document.getElementById("tenTruyen").value.trim();
  const tacGia = document.getElementById("tacGia").value.trim();
  const theLoaiRaw = document.getElementById("theLoai").value;
  const anhBia = document.getElementById("anhBia").value;
  const moTa = document.getElementById("moTa").value;

  const theLoai = theLoaiRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const res = await fetch("/api/truyen/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      tenTruyen,
      tacGia,
      theLoai,
      moTa,
      anhBia,
    }),
  });

  const data = await res.json();
  alert(data.message);
}
