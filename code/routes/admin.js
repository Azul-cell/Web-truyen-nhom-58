const express = require("express");
const User = require("../models/User");
const Truyen = require("../models/Truyen");

// kiểm tra đăng nhập (JWT)
const auth = require("../middleware/auth");

// kiểm tra quyền admin
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// lấy danh sách user, không trả về mật khẩu
// chỉ admin mới được xem
router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được danh sách user" });
  }
});

// khoá hoặc mở khoá tài khoản user
// mỗi lần gọi sẽ đổi trạng thái banned
router.post("/ban/:id", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.banned = !user.banned;
    await user.save();

    res.json({
      message: user.banned ? "User đã bị khoá" : "User đã được mở khoá",
      banned: user.banned,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái user" });
  }
});

// xoá truyện
// tác giả chỉ được xoá truyện của mình
// admin có thể xoá mọi truyện
router.delete("/truyen/:id", auth, async (req, res) => {
  try {
    const truyen = await Truyen.findById(req.params.id);

    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const isOwner =
      truyen.tacGiaId && truyen.tacGiaId.toString() === req.user.userId;

    const isAdminUser = req.user.capBac === 2;

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: "Không có quyền xoá truyện" });
    }

    await Truyen.findByIdAndDelete(req.params.id);

    res.json({ message: "Xoá truyện thành công" });
  } catch (err) {
    console.error("Lỗi xoá truyện:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
