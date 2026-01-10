module.exports = function isAdmin(req, res, next) {
  // chưa đăng nhập thì chặn
  if (!req.user) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  // chỉ cho phép tài khoản admin (capBac = 2)
  if (req.user.capBac !== 2) {
    return res.status(403).json({ message: "Không có quyền admin" });
  }

  // đủ quyền thì cho đi tiếp
  next();
};
