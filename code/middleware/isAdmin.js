module.exports = function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  // ⭐ Admin = capBac === 2
  if (req.user.capBac !== 2) {
    return res.status(403).json({ message: "Không có quyền admin" });
  }

  next();
};
