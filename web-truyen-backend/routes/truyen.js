const express = require('express');
const router = express.Router();
const Truyen = require('../models/Truyen');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Lấy danh sách truyện
router.get('/', async (req, res) => {
  try {
    const truyen = await Truyen.find().select('tenTruyen anhBia theLoai luotXem');
    res.json(truyen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chi tiết truyện
router.get('/:id', async (req, res) => {
  try {
    const truyen = await Truyen.findById(req.params.id);
    if (!truyen) return res.status(404).json({ message: 'Không tìm thấy' });
    truyen.luotXem += 1;
    await truyen.save();
    res.json(truyen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chương
router.get('/:id/chuong/:chap', async (req, res) => {
  try {
    const truyen = await Truyen.findById(req.params.id);
    const chuong = truyen.chuong.find(c => c.soChuong == req.params.chap);
    if (!chuong) return res.status(404).json({ message: 'Chương không tồn tại' });
    res.json(chuong);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;