const jwt = require("jsonwebtoken");
const User = require("../models/User");

// key dùng để kiểm tra token
const JWT_SECRET = "my_secret_key";

module.exports = async (req, res, next) => {
  // lấy token từ cookie
  const token = req.cookies.token;

  // không có token thì coi như chưa đăng nhập
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    // kiểm tra token có hợp lệ không
    const decoded = jwt.verify(token, JWT_SECRET);

    // lấy thông tin user từ database
    const user = await User.findById(decoded.userId);

    // user không tồn tại
    if (!user) {
      req.user = null;
      return next();
    }

    // nếu user bị khoá thì chặn request
    if (user.banned) {
      return res.status(403).json({
        message: "Tài khoản đã bị ban",
      });
    }

    // lưu thông tin cần thiết vào request
    req.user = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
      capBac: user.capBac,
    };
  } catch (err) {
    // token sai hoặc hết hạn
    req.user = null;
  }

  // cho request đi tiếp
  next();
};
