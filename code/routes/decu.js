const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");

const router = express.Router();

// Giới hạn số truyện đề cử trả về
const MAX_DECU = 6;

// API lấy danh sách truyện đề cử
// Dựa trên đánh giá sao của người đọc
// Chỉ tính các đánh giá có số sao lớn hơn 3
router.get("/", async (req, res) => {
  try {
    // Mốc thời gian 7 ngày trước (có thể dùng cho mở rộng thống kê tuần)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const data = await Truyen.aggregate([
      // Tách từng phần tử trong mảng đánh giá để xử lý riêng
      { $unwind: "$danhGia" },

      // Lọc các đánh giá có số sao lớn hơn 3
      { $match: { "danhGia.soSao": { $gt: 3 } } },

      // lọc theo thời gian đánh giá
      { $match: { "danhGia.createdAt": { $gte: lastWeek } } },

      // Gom nhóm theo từng truyện
      {
        $group: {
          _id: "$_id", // ID truyện
          tenTruyen: { $first: "$tenTruyen" },
          tacGia: { $first: "$tacGia" },
          anhBia: { $first: "$anhBia" },
          soLuot: { $sum: 1 }, // đếm số lượt đánh giá > 3 sao
        },
      },

      // Sắp xếp giảm dần theo số lượt đánh giá
      { $sort: { soLuot: -1 } },

      // Giới hạn số truyện trả về
      { $limit: MAX_DECU },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Lỗi lấy danh sách đề cử:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
