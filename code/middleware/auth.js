const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "my_secret_key"; // sau cho vào .env

module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  // ❌ Chưa đăng nhập
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔍 LẤY USER TỪ DB
    const user = await User.findById(decoded.userId);

    // ❌ Không tồn tại
    if (!user) {
      req.user = null;
      return next();
    }

    // 🚫 USER BỊ BAN
    if (user.banned) {
      return res.status(403).json({
        message: "Tài khoản đã bị ban",
      });
    }

    // ✅ GÁN USER VÀO REQUEST
    req.user = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
      capBac: user.capBac, // 0 | 1 | 2
    };
  } catch (err) {
    req.user = null;
  }

  next();
};
