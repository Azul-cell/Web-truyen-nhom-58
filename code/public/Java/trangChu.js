// trangChu.js
let truyenGoc = [];
let truyenDangHienThi = [];

fetch("/api/truyen")
  .then((res) => res.json())
  .then((data) => {
    truyenGoc = data;
    truyenDangHienThi = data;

    renderAll(truyenDangHienThi);

    initGenreFilter(truyenGoc, (listMoi) => {
      truyenDangHienThi = listMoi;
      renderAll(truyenDangHienThi);
    });
  });
