const express = require("express");
const mongoose = require("mongoose");
const Truyen = require("../models/Truyen");
const requireCapBac = require("../middleware/requireCapBac");

const router = express.Router();

// GET /api/truyen
// Lấy danh sách tất cả truyện, sắp xếp mới nhất trước
router.get("/", async (req, res) => {
  try {
    const truyens = await Truyen.find().sort({ createdAt: -1 });
    res.json(truyens);
  } catch (err) {
    console.error("Lỗi lấy truyện:", err);
    res.status(500).json({ message: "Lỗi lấy truyện" });
  }
});

// GET /api/truyen/:id
// Lấy thông tin chi tiết của một truyện
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "ID không hợp lệ" });

  const truyen = await Truyen.findById(id);
  if (!truyen)
    return res.status(404).json({ message: "Không tìm thấy truyện" });

  res.json(truyen);
});

// POST /api/truyen
// Thêm truyện mới (chỉ tác giả trở lên)
router.post("/", requireCapBac(1), async (req, res) => {
  const { tenTruyen, tacGia, theLoai, moTa, anhBia } = req.body;

  if (!tenTruyen || !tacGia || !Array.isArray(theLoai) || !theLoai.length)
    return res.status(400).json({ message: "Thiếu dữ liệu" });

  const truyen = await Truyen.create({
    tenTruyen,
    tacGia,
    tacGiaId: req.user.userId,
    capBacTacGia: req.user.capBac,
    theLoai,
    moTa,
    anhBia,
  });

  res.json({ message: "Thêm truyện thành công", truyen });
});

// PUT /api/truyen/:id
// Cập nhật thông tin truyện (chủ truyện hoặc admin)
router.put("/:id", requireCapBac(1), async (req, res) => {
  const truyen = await Truyen.findById(req.params.id);
  if (!truyen)
    return res.status(404).json({ message: "Không tìm thấy truyện" });

  const isOwner = truyen.tacGiaId?.toString() === req.user.userId;
  const isAdmin = req.user.capBac === 2;

  if (!isOwner && !isAdmin)
    return res.status(403).json({ message: "Không có quyền sửa truyện" });

  Object.assign(truyen, req.body);
  await truyen.save();

  res.json({ message: "Sửa truyện thành công" });
});

// POST /api/truyen/:id/chuong
// Thêm chương mới cho truyện
router.post("/:id/chuong", requireCapBac(1), async (req, res) => {
  const { soChuong, tieuDe, noiDung } = req.body;

  if (!soChuong || !tieuDe || !noiDung)
    return res.status(400).json({ message: "Thiếu dữ liệu chương" });

  const truyen = await Truyen.findById(req.params.id);
  if (!truyen)
    return res.status(404).json({ message: "Không tìm thấy truyện" });

  const isOwner = truyen.tacGiaId?.toString() === req.user.userId;
  const isAdmin = req.user.capBac === 2;

  if (!isOwner && !isAdmin)
    return res.status(403).json({ message: "Không có quyền thêm chương" });

  if (truyen.chuong.some((c) => c.soChuong === Number(soChuong)))
    return res.status(400).json({ message: "Chương đã tồn tại" });

  truyen.chuong.push({
    soChuong: Number(soChuong),
    tieuDe,
    noiDung,
  });

  await truyen.save();
  res.json({ message: "Thêm chương thành công" });
});

// PUT /api/truyen/:id/chuong/:soChuong
// Cập nhật chương của truyện
router.put("/:id/chuong/:soChuong", requireCapBac(1), async (req, res) => {
  const { tieuDe, noiDung } = req.body;
  const soChuong = Number(req.params.soChuong);

  const truyen = await Truyen.findById(req.params.id);
  if (!truyen)
    return res.status(404).json({ message: "Không tìm thấy truyện" });

  const isOwner = truyen.tacGiaId?.toString() === req.user.userId;
  const isAdmin = req.user.capBac === 2;

  if (!isOwner && !isAdmin)
    return res.status(403).json({ message: "Không có quyền sửa chương" });

  const chuong = truyen.chuong.find((c) => c.soChuong === soChuong);
  if (!chuong)
    return res.status(404).json({ message: "Không tìm thấy chương" });

  chuong.tieuDe = tieuDe;
  chuong.noiDung = noiDung;

  await truyen.save();
  res.json({ message: "Cập nhật chương thành công" });
});

// DELETE /api/truyen/:id/chuong/:soChuong
// Xoá chương của truyện
router.delete("/:id/chuong/:soChuong", requireCapBac(1), async (req, res) => {
  const soChuong = Number(req.params.soChuong);

  const truyen = await Truyen.findById(req.params.id);
  if (!truyen)
    return res.status(404).json({ message: "Không tìm thấy truyện" });

  const isOwner = truyen.tacGiaId?.toString() === req.user.userId;
  const isAdmin = req.user.capBac === 2;

  if (!isOwner && !isAdmin)
    return res.status(403).json({ message: "Không có quyền xoá chương" });

  const index = truyen.chuong.findIndex((c) => c.soChuong === soChuong);
  if (index === -1)
    return res.status(404).json({ message: "Không tìm thấy chương" });

  truyen.chuong.splice(index, 1);
  await truyen.save();

  res.json({ message: "Xoá chương thành công" });
});

module.exports = router;
