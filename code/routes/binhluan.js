const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");
const auth = require("../middleware/auth");

const router = express.Router();

/* ===============================
   GET /api/binhluan/:truyenId
   LẤY BÌNH LUẬN THEO TRUYỆN
================================ */
router.get("/:truyenId", async (req, res) => {
  try {
    const { truyenId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID truyện không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    // sort mới nhất trước
    const ds = truyen.binhLuan.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(ds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ===============================
   POST /api/binhluan/:truyenId
   THÊM BÌNH LUẬN
================================ */
router.post("/:truyenId", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const { truyenId } = req.params;
    const { noiDung } = req.body;

    if (!noiDung || !noiDung.trim()) {
      return res.status(400).json({ message: "Nội dung rỗng" });
    }

    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID truyện không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const binhLuanMoi = {
      userId: req.user.userId,
      username: req.user.username, // ⭐ QUAN TRỌNG
      noiDung: noiDung.trim(),
      createdAt: new Date(),
    };

    truyen.binhLuan.push(binhLuanMoi);
    await truyen.save();

    res.json({
      message: "Bình luận thành công",
      binhLuan: binhLuanMoi,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ===============================
   DELETE /api/binhluan/:truyenId/:binhLuanId
   XOÁ BÌNH LUẬN (CHỦ / ADMIN)
================================ */
router.delete("/:truyenId/:binhLuanId", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const { truyenId, binhLuanId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(truyenId) ||
      !mongoose.Types.ObjectId.isValid(binhLuanId)
    ) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const binhLuan = truyen.binhLuan.id(binhLuanId);
    if (!binhLuan) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    // chỉ chủ comment hoặc admin
    if (
      binhLuan.userId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Không có quyền xoá" });
    }

    binhLuan.deleteOne();
    await truyen.save();

    res.json({ message: "Xoá bình luận thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
