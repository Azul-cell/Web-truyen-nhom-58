const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");
const auth = require("../middleware/auth");

const router = express.Router();

//API cho phép người dùng đánh giá sao cho một truyện
router.post("/:truyenId", auth, async (req, res) => {
  try {
    // Người dùng bắt buộc phải đăng nhập
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const { truyenId } = req.params;
    const { soSao } = req.body;

    // Kiểm tra ID truyện có hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID truyện không hợp lệ" });
    }

    // Kiểm tra số sao phải là số nguyên từ 1 đến 5
    if (!Number.isInteger(soSao) || soSao < 1 || soSao > 5) {
      return res.status(400).json({ message: "Số sao phải từ 1 đến 5" });
    }

    // Tìm truyện trong database
    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    // Kiểm tra xem người dùng đã đánh giá truyện này hay chưa
    const danhGiaCu = truyen.danhGia.find(
      (dg) => dg.userId.toString() === req.user.userId
    );

    // Nếu đã đánh giá thì cập nhật lại số sao
    if (danhGiaCu) {
      danhGiaCu.soSao = soSao;
      danhGiaCu.capBac = req.user.capBac ?? 0;
    }
    // Nếu chưa đánh giá thì thêm đánh giá mới
    else {
      truyen.danhGia.push({
        userId: req.user.userId,
        soSao: soSao,
        capBac: req.user.capBac ?? 0,
      });
    }

    await truyen.save();

    res.json({ message: "Đánh giá thành công" });
  } catch (err) {
    console.error("Lỗi đánh giá:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/*
  API lấy số sao mà người dùng hiện tại đã đánh giá cho truyện
  Nếu chưa đánh giá hoặc chưa đăng nhập thì trả về 0
*/
router.get("/:truyenId/me", auth, async (req, res) => {
  try {
    const { truyenId } = req.params;

    // Kiểm tra ID truyện
    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    // Nếu chưa đăng nhập thì không có đánh giá
    if (!req.user) {
      return res.json({ soSao: 0 });
    }

    // Tìm đánh giá của người dùng trong danh sách đánh giá
    const danhGia = truyen.danhGia.find(
      (dg) => dg.userId.toString() === req.user.userId
    );

    res.json({ soSao: danhGia ? danhGia.soSao : 0 });
  } catch (err) {
    console.error("Lỗi lấy đánh giá cá nhân:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

//API thống kê đánh giá của một truyện
router.get("/:truyenId", async (req, res) => {
  try {
    const { truyenId } = req.params;

    // Kiểm tra ID truyện
    if (!mongoose.Types.ObjectId.isValid(truyenId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const truyen = await Truyen.findById(truyenId);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const danhSachDanhGia = truyen.danhGia || [];

    // Nếu chưa có đánh giá nào
    if (danhSachDanhGia.length === 0) {
      return res.json({ avg: 0, count: 0 });
    }

    // Tính tổng số sao
    const tongSao = danhSachDanhGia.reduce((tong, dg) => tong + dg.soSao, 0);

    // Tính trung bình và làm tròn 1 chữ số thập phân
    const trungBinh = Number((tongSao / danhSachDanhGia.length).toFixed(1));

    res.json({
      avg: trungBinh,
      count: danhSachDanhGia.length,
    });
  } catch (err) {
    console.error("Lỗi thống kê đánh giá:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
