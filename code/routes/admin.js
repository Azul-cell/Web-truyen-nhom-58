const express = require("express");
const User = require("../models/User");
const Truyen = require("../models/Truyen");
const auth = require("../middleware/auth"); // xác thực đăng nhập
const isAdmin = require("../middleware/isAdmin"); // chỉ admin

const router = express.Router();

/* ===============================
   👑 ADMIN: LẤY DANH SÁCH USER
   GET /api/admin/users
================================ */
router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách user" });
  }
});

/* ===============================
   👑 ADMIN: BAN / UNBAN USER
   POST /api/admin/ban/:id
================================ */
router.post("/ban/:id", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.banned = !user.banned;
    await user.save();

    res.json({
      message: user.banned ? "Đã ban user" : "Đã unban user",
      banned: user.banned,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi ban / unban user" });
  }
});

/* =================================================
   🗑 XOÁ TRUYỆN
   - Tác giả: xoá truyện của mình
   - Admin: xoá mọi truyện
   DELETE /api/admin/truyen/:id
================================================= */
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
    console.error("❌ Lỗi xoá truyện:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
