const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

/* =================================================
   GET /api/truyen
================================================= */
router.get("/", async (req, res) => {
  try {
    const truyens = await Truyen.find().sort({ createdAt: -1 });
    res.json(truyens);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy truyện" });
  }
});

/* =================================================
   GET /api/truyen/:id
================================================= */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const truyen = await Truyen.findById(id);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    res.json(truyen);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   POST /api/truyen
================================================= */
router.post("/", isAdmin, async (req, res) => {
  try {
    const { tenTruyen, tacGia, theLoai, moTa, anhBia } = req.body;

    if (!tenTruyen || !tacGia || !Array.isArray(theLoai) || !theLoai.length) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const truyen = await Truyen.create({
      tenTruyen,
      tacGia,
      theLoai,
      moTa,
      anhBia,
      createdBy: req.user.userId,
    });

    res.json({ message: "Thêm truyện thành công", truyen });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   GET /api/truyen/:id/chuong
================================================= */
router.get("/:id/chuong", async (req, res) => {
  try {
    const truyen = await Truyen.findById(req.params.id);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    // sắp xếp chương tăng dần
    const dsChuong = truyen.chuong.sort((a, b) => a.soChuong - b.soChuong);
    res.json(dsChuong);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   POST /api/truyen/:id/chuong
   ➕ THÊM CHƯƠNG (ADMIN)
================================================= */
router.post("/:id/chuong", isAdmin, async (req, res) => {
  try {
    const { soChuong, tieuDe, noiDung } = req.body;

    if (!soChuong || !tieuDe || !noiDung) {
      return res.status(400).json({ message: "Thiếu dữ liệu chương" });
    }

    const truyen = await Truyen.findById(req.params.id);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    // chặn trùng chương
    const trung = truyen.chuong.find((c) => c.soChuong === Number(soChuong));
    if (trung) {
      return res.status(400).json({ message: "Chương đã tồn tại" });
    }

    truyen.chuong.push({
      soChuong: Number(soChuong),
      tieuDe,
      noiDung,
    });

    await truyen.save();
    res.json({ message: "Thêm chương thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   PUT /api/truyen/:id/chuong/:soChuong
   ✏️ SỬA CHƯƠNG (ADMIN)
================================================= */
router.put("/:id/chuong/:soChuong", isAdmin, async (req, res) => {
  try {
    const { tieuDe, noiDung } = req.body;
    const soChuong = Number(req.params.soChuong);

    const truyen = await Truyen.findById(req.params.id);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const chuong = truyen.chuong.find((c) => c.soChuong === soChuong);
    if (!chuong) {
      return res.status(404).json({ message: "Không tìm thấy chương" });
    }

    chuong.tieuDe = tieuDe;
    chuong.noiDung = noiDung;

    await truyen.save();
    res.json({ message: "Cập nhật chương thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   DELETE /api/truyen/:id/chuong/:soChuong
   🗑️ XOÁ CHƯƠNG (ADMIN)
================================================= */
router.delete("/:id/chuong/:soChuong", isAdmin, async (req, res) => {
  try {
    const soChuong = Number(req.params.soChuong);

    const truyen = await Truyen.findById(req.params.id);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const index = truyen.chuong.findIndex((c) => c.soChuong === soChuong);
    if (index === -1) {
      return res.status(404).json({ message: "Không tìm thấy chương" });
    }

    truyen.chuong.splice(index, 1);
    await truyen.save();

    res.json({ message: "Xoá chương thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
