const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/* ===============================
   GET /api/me
   LẤY THÔNG TIN USER ĐANG LOGIN
================================ */
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json(null);
    }

    const user = await User.findById(req.user.userId).select(
      "username role following"
    );

    if (!user) {
      return res.status(401).json(null);
    }

    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      following: user.following,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
