const express = require("express");
const Truyen = require("../models/Truyen");

const router = express.Router();

/* ===============================
   GET /api/xephang/danhgia
   XẾP HẠNG THEO ĐÁNH GIÁ
================================ */
router.get("/danhgia", async (req, res) => {
  try {
    const truyens = await Truyen.find();

    const ketQua = truyens
      .map((t) => {
        const ds = t.danhGia || [];
        const tong = ds.reduce((s, d) => s + d.soSao, 0);
        const diemTB = ds.length ? tong / ds.length : 0;

        return {
          _id: t._id,
          tenTruyen: t.tenTruyen,
          anhBia: t.anhBia,
          diemTB: Number(diemTB.toFixed(1)),
          soLuot: ds.length,
        };
      })
      .sort((a, b) => b.diemTB - a.diemTB);

    res.json(ketQua);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xếp hạng" });
  }
});

module.exports = router;
