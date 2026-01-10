const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// POST /api/follow/:truyenId
// Toggle theo dõi một truyện (nếu chưa theo dõi → theo dõi, nếu đã theo dõi → bỏ theo dõi)
router.post("/:truyenId", async (req, res) => {
  try {
    // kiểm tra đăng nhập
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const { truyenId } = req.params;

    // kiểm tra ID truyện hợp lệ
    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID truyện không hợp lệ" });
    }

    // lấy thông tin user từ DB
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // kiểm tra xem user đã theo dõi truyện chưa
    const index = user.following.findIndex((id) => id.toString() === truyenId);

    if (index === -1) {
      // nếu chưa theo dõi, thêm vào danh sách
      user.following.push(truyenId);
      await user.save();
      return res.json({ followed: true });
    }

    // nếu đã theo dõi, bỏ khỏi danh sách
    user.following.splice(index, 1);
    await user.save();
    res.json({ followed: false });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// GET /api/follow
// Lấy danh sách truyện mà user đang theo dõi
router.get("/", async (req, res) => {
  try {
    // kiểm tra đăng nhập
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    // Lấy thông tin user và điền chi tiết các truyện mà user đang theo dõi
    const user = await User.findById(req.user.userId).populate("following");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json(user.following);
  } catch (err) {
    console.error("Get follow error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
