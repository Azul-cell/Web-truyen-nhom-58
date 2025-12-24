const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "my_secret_key";

/* =================================================
   REGISTER
================================================= */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // ===== VALIDATE =====
  if (!username || username.length < 5)
    return res.status(400).json({ message: "Username ≥ 5 ký tự" });

  if (!email) return res.status(400).json({ message: "Email là bắt buộc" });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: "Email không hợp lệ" });

  if (!password || password.length < 6)
    return res.status(400).json({ message: "Mật khẩu ≥ 6 ký tự" });

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    return res.status(400).json({ message: "Mật khẩu phải chứa chữ và số" });

  // ===== CHECK EXIST =====
  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existUser)
    return res.status(400).json({ message: "Username hoặc email đã tồn tại" });

  // ===== CREATE =====
  const hash = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hash,
    capBac: 0, // ⭐ user thường
  });

  res.json({ message: "Đăng ký thành công" });
});

/* =================================================
   LOGIN
================================================= */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Sai tài khoản" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Sai mật khẩu" });

  // ===== JWT =====
  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      capBac: user.capBac, // ⭐ THAY role
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  // ===== COOKIE =====
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Đăng nhập thành công" });
});

/* =================================================
   LOGOUT
================================================= */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    sameSite: "lax",
  });

  res.json({ message: "Đã đăng xuất" });
});

module.exports = router;
