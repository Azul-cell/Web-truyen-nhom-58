const express = require("express");
const Truyen = require("../models/Truyen");

const router = express.Router();

// GET /api/xephang/danhgia
// Lấy top truyện hay nhất mọi thời điểm dựa trên điểm trung bình đánh giá
router.get("/danhgia", async (req, res) => {
  try {
    // Lấy tất cả truyện
    const truyens = await Truyen.find();

    // Tính điểm trung bình và sắp xếp
    const ketQua = truyens
      .map((t) => {
        const ds = t.danhGia || [];
        if (ds.length === 0) return null; // bỏ truyện chưa có đánh giá

        const tong = ds.reduce((s, d) => s + d.soSao, 0);
        const diemTB = tong / ds.length;

        return {
          _id: t._id,
          tenTruyen: t.tenTruyen,
          anhBia: t.anhBia,
          diemTB: Number(diemTB.toFixed(1)), // làm tròn 1 chữ số
          soLuot: ds.length, // số lượt đánh giá
        };
      })
      .filter(Boolean) // loại bỏ null
      // Sắp xếp: ưu tiên điểm trung bình, sau đó số lượt đánh giá
      .sort((a, b) => {
        if (b.diemTB !== a.diemTB) return b.diemTB - a.diemTB;
        return b.soLuot - a.soLuot;
      });

    res.json(ketQua);
  } catch (err) {
    console.error("Lỗi xếp hạng:", err);
    res.status(500).json({ message: "Lỗi xếp hạng" });
  }
});

module.exports = router;
