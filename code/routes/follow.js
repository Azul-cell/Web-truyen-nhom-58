const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

/* ===============================
   POST /api/follow/:truyenId
   TOGGLE THEO DÕI
================================ */
router.post("/:truyenId", async (req, res) => {
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

    const index = user.following.findIndex((id) => id.toString() === truyenId);

    // ❌ chưa theo dõi → thêm
    if (index === -1) {
      user.following.push(truyenId);
      await user.save();
      return res.json({ followed: true });
    }

    // ✅ đã theo dõi → bỏ
    user.following.splice(index, 1);
    await user.save();
    res.json({ followed: false });
  } catch (err) {
    console.error("❌ Follow error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ===============================
   GET /api/follow
   LẤY TRUYỆN ĐANG THEO DÕI
================================ */
router.get("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const user = await User.findById(req.user.userId).populate("following");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json(user.following);
  } catch (err) {
    console.error("❌ Get follow error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
