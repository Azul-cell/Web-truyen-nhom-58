const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/* ===============================
   GET /api/me
================================ */
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json(null);
    }

    const user = await User.findById(req.user.userId).select(
      "_id username email capBac banned following"
    );

    if (!user) {
      return res.status(401).json(null);
    }

    // ❌ user bị ban → đá ra
    if (user.banned) {
      return res.status(403).json({ message: "Tài khoản đã bị khoá" });
    }

    // ✅ trả đủ cho frontend
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      capBac: user.capBac ?? 0,
      banned: user.banned ?? false,
      following: user.following ?? [],
    });
  } catch (err) {
    console.error("GET /api/me error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
