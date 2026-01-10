const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// GET /api/me
// Lấy thông tin user hiện tại
router.get("/", auth, async (req, res) => {
  try {
    // Kiểm tra đã đăng nhập chưa
    if (!req.user) return res.status(401).json(null);

    // Lấy thông tin user từ DB
    const user = await User.findById(req.user.userId).select(
      "_id username email capBac banned following"
    );

    if (!user) return res.status(401).json(null);

    // Nếu user bị ban → trả lỗi 403
    if (user.banned) {
      return res.status(403).json({ message: "Tài khoản đã bị khoá" });
    }

    // Trả dữ liệu đầy đủ cho frontend
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      capBac: user.capBac ?? 0,
      banned: user.banned ?? false,
      following: user.following ?? [],
    });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
