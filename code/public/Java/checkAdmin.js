document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/me", {
      credentials: "same-origin",
    });

    if (!res.ok) {
      location.href = "/Html/dangNhap.html";
      return;
    }

    const user = await res.json();

    // ❌ KHÔNG dùng role
    // ⭐ CHỈ dùng capBac
    if (!user || user.capBac < 1) {
      alert("Bạn không có quyền truy cập trang này");
      location.href = "/";
    }
  } catch (err) {
    location.href = "/";
  }
});
