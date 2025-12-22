const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");
const auth = require("../middleware/auth");

const router = express.Router();

/* =================================================
   POST /api/danhgia/:truyenId
   ĐÁNH GIÁ / CẬP NHẬT
================================================= */
router.post("/:truyenId", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const { truyenId } = req.params;
    const { soSao } = req.body;

    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID truyện không hợp lệ" });
    }

    if (!soSao || soSao < 1 || soSao > 5) {
      return res.status(400).json({ message: "Số sao không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const daDanhGia = truyen.danhGia.find(
      (dg) => dg.userId.toString() === req.user.userId
    );

    if (daDanhGia) {
      daDanhGia.soSao = soSao;
    } else {
      truyen.danhGia.push({
        userId: req.user.userId,
        soSao,
      });
    }

    await truyen.save();
    res.json({ message: "Đánh giá thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   GET /api/danhgia/:truyenId/me
   ⭐ LẤY SAO USER ĐÃ ĐÁNH
================================================= */
router.get("/:truyenId/me", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ soSao: 0 });
    }

    const { truyenId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const danhGia = truyen.danhGia.find(
      (dg) => dg.userId.toString() === req.user.userId
    );

    res.json({ soSao: danhGia ? danhGia.soSao : 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   GET /api/danhgia/:truyenId
   ⭐ ĐIỂM TRUNG BÌNH + LƯỢT ĐÁNH
================================================= */
router.get("/:truyenId", async (req, res) => {
  try {
    const truyen = await Truyen.findById(req.params.truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const ds = truyen.danhGia || [];
    if (ds.length === 0) {
      return res.json({ avg: 0, count: 0 });
    }

    const tong = ds.reduce((s, d) => s + d.soSao, 0);
    const avg = Number((tong / ds.length).toFixed(1));

    res.json({ avg, count: ds.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
