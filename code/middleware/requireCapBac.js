module.exports = function requireCapBac(minCapBac) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    if ((req.user.capBac ?? 0) < minCapBac) {
      return res.status(403).json({ message: "Không đủ quyền" });
    }

    next();
  };
};
