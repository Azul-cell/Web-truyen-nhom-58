const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");
const requireCapBac = require("../middleware/requireCapBac");

const router = express.Router();

/* =================================================
   GET /api/truyen
   ✅ AI CŨNG XEM ĐƯỢC
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const truyen = await Truyen.findById(req.params.id);
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
   🔒 capBac >= 1 (người đăng + admin)
================================================= */
router.post("/", requireCapBac(1), async (req, res) => {
  try {
    const { tenTruyen, tacGia, theLoai, moTa, anhBia } = req.body;

    if (
      !tenTruyen ||
      !tacGia || // 👈 bắt buộc nhập tay
      !Array.isArray(theLoai) ||
      !theLoai.length
    ) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const truyen = await Truyen.create({
      tenTruyen,
      tacGia, // ✅ GIỮ NGUYÊN TÊN NHẬP
      tacGiaId: req.user.userId, // ⭐ BẮT BUỘC (phân quyền)
      capBacTacGia: req.user.capBac ?? 1,
      theLoai,
      moTa,
      anhBia,
    });

    res.json({ message: "Thêm truyện thành công", truyen });
  } catch (err) {
    console.error("❌ Lỗi tạo truyện:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =================================================
   GET /api/truyen/:id/chuong
================================================= */
router.post("/:id/chuong", requireCapBac(1), async (req, res) => {
  try {
    const { soChuong, tieuDe, noiDung } = req.body;

    if (!soChuong || !tieuDe || !noiDung) {
      return res.status(400).json({ message: "Thiếu dữ liệu chương" });
    }

    const truyen = await Truyen.findById(req.params.id);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const isOwner = truyen.tacGiaId.toString() === req.user.userId;
    const isAdmin = req.user.capBac === 2;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Không có quyền thêm chương" });
    }

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
   🔒 capBac >= 1
================================================= */
router.put("/:id/chuong/:soChuong", requireCapBac(1), async (req, res) => {
  try {
    const soChuong = Number(req.params.soChuong);
    const { tieuDe, noiDung } = req.body;

    const truyen = await Truyen.findById(req.params.id);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const isOwner = truyen.tacGiaId.toString() === req.user.userId;
    const isAdmin = req.user.capBac === 2;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Không có quyền sửa chương" });
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
   🔒 capBac >= 2 (CHỈ ADMIN XOÁ)
================================================= */
router.delete("/:id/chuong/:soChuong", requireCapBac(1), async (req, res) => {
  try {
    const soChuong = Number(req.params.soChuong);

    const truyen = await Truyen.findById(req.params.id);
    if (!truyen) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    const isOwner = truyen.tacGiaId.toString() === req.user.userId;
    const isAdmin = req.user.capBac === 2;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Không có quyền xoá chương" });
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
