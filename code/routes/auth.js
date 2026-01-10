const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "my_secret_key";

// đăng ký tài khoản mới
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // kiểm tra username
  if (!username || username.length < 5)
    return res.status(400).json({ message: "Username ≥ 5 ký tự" });

  // kiểm tra email
  if (!email) return res.status(400).json({ message: "Email là bắt buộc" });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: "Email không hợp lệ" });

  // kiểm tra mật khẩu
  if (!password || password.length < 6)
    return res.status(400).json({ message: "Mật khẩu ≥ 6 ký tự" });

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    return res.status(400).json({ message: "Mật khẩu phải chứa chữ và số" });

  // kiểm tra trùng username hoặc email
  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existUser)
    return res.status(400).json({ message: "Username hoặc email đã tồn tại" });

  // mã hoá mật khẩu
  const hash = await bcrypt.hash(password, 10);

  // tạo user mới
  await User.create({
    username,
    email,
    password: hash,
    capBac: 0, // user thường
    banned: false,
  });

  res.json({ message: "Đăng ký thành công" });
});

// đăng nhập hệ thống
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // tìm user theo username
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Sai tài khoản" });

  // kiểm tra tài khoản có bị khoá không
  if (user.banned)
    return res.status(403).json({ message: "Tài khoản bị khoá" });

  // so sánh mật khẩu
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Sai mật khẩu" });

  // tạo token đăng nhập
  const token = jwt.sign(
    {
      userId: user._id,
      capBac: user.capBac,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  // lưu token vào cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Đăng nhập thành công" });
});

// lấy thông tin người dùng đang đăng nhập
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    // giải mã token
    const decoded = jwt.verify(token, JWT_SECRET);

    // lấy thông tin user
    const user = await User.findById(decoded.userId).select(
      "_id username email capBac banned"
    );

    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    if (user.banned)
      return res.status(403).json({ message: "Tài khoản bị khoá" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
});

// ban hoặc mở khoá tài khoản (admin)
router.post("/admin/ban/:id", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    const decoded = jwt.verify(token, JWT_SECRET);

    // chỉ admin mới có quyền
    if (decoded.capBac !== 2)
      return res.status(403).json({ message: "Không có quyền" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    // đảo trạng thái ban
    user.banned = !user.banned;
    await user.save();

    res.json({
      message: user.banned ? "Đã ban user" : "Đã unban user",
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// đăng xuất tài khoản
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    sameSite: "lax",
  });

  res.json({ message: "Đã đăng xuất" });
});

module.exports = router;
