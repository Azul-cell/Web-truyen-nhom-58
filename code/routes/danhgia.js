const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");
const auth = require("../middleware/auth");

const router = express.Router();

/* =================================================
   POST /api/danhgia/:truyenId
================================================= */
router.post("/:truyenId", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const { truyenId } = req.params;
    const { soSao } = req.body;

    // 1️⃣ check id
    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID truyện không hợp lệ" });
    }

    // 2️⃣ check sao
    if (!Number.isInteger(soSao) || soSao < 1 || soSao > 5) {
      return res.status(400).json({ message: "Số sao phải từ 1 đến 5" });
    }

    // 3️⃣ tìm truyện
    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    // 4️⃣ tìm đánh giá cũ (DÙNG userId)
    const daDanhGia = truyen.danhGia.find(
      (dg) => dg.userId.toString() === req.user.userId
    );

    // 5️⃣ update hoặc thêm mới
    if (daDanhGia) {
      daDanhGia.soSao = soSao;
      daDanhGia.capBac = req.user.capBac ?? 0;
    } else {
      truyen.danhGia.push({
        userId: req.user.userId,
        soSao,
        capBac: req.user.capBac ?? 0,
      });
    }

    await truyen.save();
    res.json({ message: "Đánh giá thành công" });
  } catch (err) {
    console.error("❌ Lỗi đánh giá:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   GET /api/danhgia/:truyenId/me
================================================= */
router.get("/:truyenId/me", auth, async (req, res) => {
  try {
    const { truyenId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    // chưa login
    if (!req.user) {
      return res.json({ soSao: 0 });
    }

    const danhGia = truyen.danhGia.find(
      (dg) => dg.userId.toString() === req.user.userId
    );

    res.json({ soSao: danhGia ? danhGia.soSao : 0 });
  } catch (err) {
    console.error("❌ Lỗi lấy sao cá nhân:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   GET /api/danhgia/:truyenId
================================================= */
router.get("/:truyenId", async (req, res) => {
  try {
    const { truyenId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
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
    console.error("❌ Lỗi thống kê sao:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
