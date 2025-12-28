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

  if (!username || username.length < 5)
    return res.status(400).json({ message: "Username ≥ 5 ký tự" });

  if (!email) return res.status(400).json({ message: "Email là bắt buộc" });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: "Email không hợp lệ" });

  if (!password || password.length < 6)
    return res.status(400).json({ message: "Mật khẩu ≥ 6 ký tự" });

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    return res.status(400).json({ message: "Mật khẩu phải chứa chữ và số" });

  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existUser)
    return res.status(400).json({ message: "Username hoặc email đã tồn tại" });

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hash,
    capBac: 0,
    banned: false,
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

  if (user.banned)
    return res.status(403).json({ message: "Tài khoản bị khoá" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Sai mật khẩu" });

  const token = jwt.sign(
    {
      userId: user._id,
      capBac: user.capBac,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Đăng nhập thành công" });
});

/* =================================================
   GET PROFILE (API /api/me)
================================================= */
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "_id username email capBac banned"
    );

    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    if (user.banned)
      return res.status(403).json({ message: "Tài khoản bị khoá" });

    res.json(user); // ⭐ EMAIL TRẢ Ở ĐÂY
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
});

/* =================================================
   BAN / UNBAN (ADMIN)
================================================= */
router.post("/admin/ban/:id", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.capBac !== 2)
      return res.status(403).json({ message: "Không có quyền" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    user.banned = !user.banned;
    await user.save();

    res.json({
      message: user.banned ? "Đã ban user" : "Đã unban user",
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
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
