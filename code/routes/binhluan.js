const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");
const auth = require("../middleware/auth");

const router = express.Router();

// Lấy danh sách bình luận của một truyện
router.get("/:truyenId", async (req, res) => {
  try {
    const { truyenId } = req.params;

    // Kiểm tra ID truyện hợp lệ
    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID truyện không hợp lệ" });
    }

    // Tìm truyện theo ID
    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    // Sắp xếp bình luận mới nhất trước
    const danhSachBinhLuan = truyen.binhLuan.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(danhSachBinhLuan);
  } catch (err) {
    console.error("Lỗi khi lấy bình luận:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Thêm bình luận cho truyện
router.post("/:truyenId", auth, async (req, res) => {
  try {
    // Kiểm tra người dùng đã đăng nhập
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const { truyenId } = req.params;
    const { noiDung } = req.body;

    if (!noiDung || !noiDung.trim()) {
      return res.status(400).json({ message: "Nội dung bình luận rỗng" });
    }

    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID truyện không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    // Tạo object bình luận mới
    const binhLuanMoi = {
      userId: req.user.userId,
      username: req.user.username,
      capBac: req.user.capBac ?? 0,
      noiDung: noiDung.trim(),
      createdAt: new Date(),
    };

    // Thêm vào danh sách bình luận
    truyen.binhLuan.push(binhLuanMoi);
    await truyen.save();

    res.json({
      message: "Bình luận thành công",
      binhLuan: binhLuanMoi,
    });
  } catch (err) {
    console.error("Lỗi khi thêm bình luận:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Xoá bình luận
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

    // Kiểm tra quyền xoá: chủ bình luận hoặc quản trị viên
    const laChuBinhLuan = binhLuan.userId.toString() === req.user.userId;
    const laQuanLy = req.user.capBac >= 2;

    if (!laChuBinhLuan && !laQuanLy) {
      return res.status(403).json({ message: "Không có quyền xoá bình luận" });
    }

    binhLuan.deleteOne();
    await truyen.save();

    res.json({ message: "Xoá bình luận thành công" });
  } catch (err) {
    console.error("Lỗi khi xoá bình luận:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
