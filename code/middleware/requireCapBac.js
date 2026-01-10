module.exports = function requireCapBac(minCapBac) {
  return (req, res, next) => {
    //kiểm tra đăng nhập
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    //kiểm tra quyen hạn ,nếu nhỏ hơn câp bậc tối thiểu yêu cầu => chặn
    if ((req.user.capBac ?? 0) < minCapBac) {
      return res.status(403).json({ message: "Không đủ quyền" });
    }

    next();
  };
};
