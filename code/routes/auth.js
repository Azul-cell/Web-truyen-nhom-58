const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "my_secret_key";

/* ===== REGISTER ===== */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || username.length < 5)
    return res.status(400).json({ message: "Tài khoản ≥ 5 ký tự" });

  if (!password || password.length < 6)
    return res.status(400).json({ message: "Mật khẩu ≥ 6 ký tự" });

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    return res.status(400).json({ message: "Mật khẩu phải có chữ và số" });

  const exist = await User.findOne({ username });
  if (exist) return res.status(400).json({ message: "Tài khoản đã tồn tại" });

  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, password: hash });

  res.json({ message: "Đăng ký thành công" });
});

/* ===== LOGIN ===== */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Sai tài khoản" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Sai mật khẩu" });

  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username, // ⭐ THÊM DÒNG NÀY
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax", // 🔥 BẮT BUỘC
    path: "/", // 🔥 RẤT QUAN TRỌNG
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Đăng nhập thành công" });
});

/* ===== LOGOUT ===== */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/", // ⭐ PHẢI GIỐNG KHI SET
    sameSite: "lax", // ⭐ PHẢI GIỐNG KHI SET
  });

  res.json({ message: "Đã đăng xuất" });
});

module.exports = router;
