async function addTruyen() {
  const tenTruyen = document.getElementById("title").value.trim();
  const tacGia = document.getElementById("author").value.trim();
  const anhBia = document.getElementById("cover").value.trim();
  const moTa = document.getElementById("desc").value.trim();

  const theLoai = getSelectedGenres(); // mảng thể loại

  if (!tenTruyen || !tacGia || theLoai.length === 0) {
    alert("Vui lòng nhập đủ thông tin & chọn thể loại");
    return;
  }

  const res = await fetch("/api/truyen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin", // 🔥 giữ cookie JWT
    body: JSON.stringify({
      tenTruyen,
      tacGia,
      theLoai,
      moTa,
      anhBia,
    }),
  });

  const text = await res.text();

  try {
    const data = JSON.parse(text);
    alert(data.message);
  } catch {
    console.error(text);
    alert("Server trả về lỗi (không phải JSON)");
  }

  if (res.ok) {
    // reset form
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("cover").value = "";
    document.getElementById("desc").value = "";
    clearSelectedGenres();
  }
}
