const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/* ===============================
   POST /api/history/:truyenId
   LƯU / CẬP NHẬT LỊCH SỬ XEM
================================ */
router.post("/:truyenId", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const { truyenId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID truyện không hợp lệ" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // 🔎 kiểm tra đã có trong lịch sử chưa
    const index = user.history.findIndex(
      (h) => h.truyenId.toString() === truyenId
    );

    if (index !== -1) {
      // ✅ đã có → cập nhật thời gian
      user.history[index].lastReadAt = new Date();
    } else {
      // ❌ chưa có → thêm mới
      user.history.push({
        truyenId,
        lastReadAt: new Date(),
      });
    }

    await user.save();
    res.json({ message: "Đã lưu lịch sử xem" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ===============================
   GET /api/history
   LẤY DANH SÁCH LỊCH SỬ
================================ */
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) return res.json([]);

    const user = await User.findById(req.user.userId)
      .populate("history.truyenId")
      .select("history");

    if (!user || !user.history) return res.json([]);

    // sắp xếp mới nhất → cũ
    const ds = user.history
      .sort((a, b) => b.lastReadAt - a.lastReadAt)
      .map((h) => ({
        _id: h.truyenId?._id,
        tenTruyen: h.truyenId?.tenTruyen,
        anhBia: h.truyenId?.anhBia,
        lastReadAt: h.lastReadAt,
      }))
      .filter((h) => h._id); // tránh truyện đã xoá

    res.json(ds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
