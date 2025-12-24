const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/* ===============================
   GET /api/me
   LẤY USER ĐANG ĐĂNG NHẬP
================================ */
router.get("/", auth, async (req, res) => {
  try {
    // ❌ chưa đăng nhập
    if (!req.user) {
      return res.status(401).json(null);
    }

    const user = await User.findById(req.user.userId).select(
      "username capBac following"
    );

    if (!user) {
      return res.status(401).json(null);
    }

    // ✅ dữ liệu an toàn cho frontend
    res.json({
      _id: user._id,
      username: user.username,
      capBac: user.capBac ?? 0, // 🔥 fallback chuẩn
      following: user.following ?? [],
    });
  } catch (err) {
    console.error("GET /api/me error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
