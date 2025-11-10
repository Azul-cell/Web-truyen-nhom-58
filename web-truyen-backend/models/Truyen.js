const mongoose = require('mongoose');

const truyenSchema = new mongoose.Schema({
  tenTruyen: { type: String, required: true },
  tacGia: String,
  moTa: String,
  theLoai: [String],
  anhBia: String, // URL từ Cloudinary
  chuong: [
    {
      soChuong: Number,
      tieuDe: String,
      trang: [String] // Mảng URL ảnh từng trang
    }
  ],
  luotXem: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Truyen', truyenSchema);