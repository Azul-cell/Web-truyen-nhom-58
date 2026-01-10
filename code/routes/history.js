const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// POST /api/history/:truyenId
// Lưu hoặc cập nhật lịch sử xem truyện của user
router.post("/:truyenId", auth, async (req, res) => {
  try {
    // Kiểm tra người dùng đã đăng nhập
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

    const { truyenId } = req.params;

    // Kiểm tra ID truyện hợp lệ
    if (!mongoose.Types.ObjectId.isValid(truyenId))
      return res.status(400).json({ message: "ID truyện không hợp lệ" });

    // Lấy thông tin user từ database
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // Kiểm tra xem truyện đã có trong lịch sử chưa
    const index = user.history.findIndex(
      (h) => h.truyenId.toString() === truyenId
    );

    if (index !== -1) {
      // Nếu đã có → cập nhật thời gian xem
      user.history[index].lastReadAt = new Date();
    } else {
      // Nếu chưa có → thêm mới vào lịch sử
      user.history.push({
        truyenId,
        lastReadAt: new Date(),
      });
    }

    // Lưu lại user với lịch sử mới
    await user.save();

    res.json({ message: "Đã lưu lịch sử xem" });
  } catch (err) {
    console.error("Lỗi lưu lịch sử xem:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// GET /api/history
// Lấy danh sách lịch sử xem truyện của user, mới nhất trước
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) return res.json([]);

    // Lấy user và populate trường history.truyenId để lấy dữ liệu chi tiết của truyện
    const user = await User.findById(req.user.userId)
      .populate("history.truyenId")
      .select("history");

    if (!user || !user.history) return res.json([]);

    // Sắp xếp lịch sử từ mới nhất đến cũ nhất
    const ds = user.history
      .sort((a, b) => b.lastReadAt - a.lastReadAt)
      .map((h) => ({
        _id: h.truyenId?._id,
        tenTruyen: h.truyenId?.tenTruyen,
        anhBia: h.truyenId?.anhBia,
        lastReadAt: h.lastReadAt,
      }))
      .filter((h) => h._id); // Loại bỏ những truyện đã bị xoá

    res.json(ds);
  } catch (err) {
    console.error("Lỗi lấy lịch sử xem:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
