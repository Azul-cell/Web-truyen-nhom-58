const openBtn = document.getElementById("openLogin");
const closeBtn = document.getElementById("closeLogin");
const form = document.getElementById("login");
const overlay = document.getElementById("overlay");
openBtn.onclick = () => {
  form.style.display = "block";
  overlay.style.display = "block";
};

closeBtn.onclick = () => {
  form.style.display = "none";
  overlay.style.display = "none";
};

overlay.onclick = () => {
  form.style.display = "none";
  overlay.style.display = "none";
};
