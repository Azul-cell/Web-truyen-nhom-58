const express = require("express");
const Truyen = require("../models/Truyen");

const router = express.Router();

/* ===============================
   GET /api/xephang/danhgia
   🏆 TOP TRUYỆN HAY NHẤT MỌI THỜI ĐIỂM
================================ */
router.get("/danhgia", async (req, res) => {
  try {
    const truyens = await Truyen.find();

    const ketQua = truyens
      .map((t) => {
        const ds = t.danhGia || [];
        if (ds.length === 0) return null;

        const tong = ds.reduce((s, d) => s + d.soSao, 0);
        const diemTB = tong / ds.length;

        return {
          _id: t._id,
          tenTruyen: t.tenTruyen,
          anhBia: t.anhBia,
          diemTB: Number(diemTB.toFixed(1)),
          soLuot: ds.length,
        };
      })
      .filter(Boolean)
      // ⭐ ưu tiên điểm, sau đó số lượt
      .sort((a, b) => {
        if (b.diemTB !== a.diemTB) return b.diemTB - a.diemTB;
        return b.soLuot - a.soLuot;
      });

    res.json(ketQua);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xếp hạng" });
  }
});

module.exports = router;
