const express = require('express');
const router = express.Router();
const Truyen = require('../models/Truyen');
const multer = require('multer');
const { uploadToCloudinary } = require('../utils/cloudinary');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('trang'), async (req, res) => {
  try {
    const { tenTruyen, tacGia, moTa, theLoai, soChuong, tieuDe } = req.body;
    const files = req.files;

    // Upload ảnh bìa
    const anhBia = await uploadToCloudinary(files[0].path);

    // Upload các trang
    const trangUrls = [];
    for (let i = 1; i < files.length; i++) {
      const url = await uploadToCloudinary(files[i].path);
      trangUrls.push(url);
    }

    // Tìm hoặc tạo truyện
    let truyen = await Truyen.findOne({ tenTruyen });
    if (!truyen) {
      truyen = new Truyen({
        tenTruyen, tacGia, moTa, theLoai: theLoai.split(','), anhBia
      });
    }

    // Thêm chương
    truyen.chuong.push({
      soChuong: parseInt(soChuong),
      tieuDe,
      trang: trangUrls
    });

    await truyen.save();
    res.json({ message: 'Upload thành công!', truyen });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;