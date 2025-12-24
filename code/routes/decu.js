const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");

const router = express.Router();

// số truyện đề cử
const MAX_DECU = 10;

/* =================================================
   GET /api/decu
   🔥 TRUYỆN ĐỀ CỬ TRONG TUẦN
   ⭐ nhiều lượt đánh giá > 3 sao nhất
================================================= */
router.get("/", async (req, res) => {
  try {
    // mốc 7 ngày trước
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const data = await Truyen.aggregate([
      // tách từng đánh giá
      { $unwind: "$danhGia" },

      // chỉ lấy đánh giá > 3 sao
      { $match: { "danhGia.soSao": { $gt: 3 } } },

      // nếu sau này bạn thêm createdAt cho danhGia
      // { $match: { "danhGia.createdAt": { $gte: lastWeek } } },

      // gom theo truyện
      {
        $group: {
          _id: "$_id",
          tenTruyen: { $first: "$tenTruyen" },
          tacGia: { $first: "$tacGia" },
          anhBia: { $first: "$anhBia" },
          soLuot: { $sum: 1 }, // số lượt >3⭐
        },
      },

      // sắp xếp nhiều lượt nhất
      { $sort: { soLuot: -1 } },

      // giới hạn
      { $limit: MAX_DECU },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Lỗi đề cử:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
