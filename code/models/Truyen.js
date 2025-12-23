const mongoose = require("mongoose");

/* ===== BÌNH LUẬN ===== */
const binhLuanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: String,
    noiDung: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* ===== CHƯƠNG ===== */
const chuongSchema = new mongoose.Schema({
  soChuong: Number,
  tieuDe: String,
  noiDung: String,
});

/* ===== ĐÁNH GIÁ ===== */
const danhGiaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    soSao: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

/* ===== TRUYỆN ===== */
const truyenSchema = new mongoose.Schema(
  {
    tenTruyen: String,
    tacGia: String,
    theLoai: [String],
    moTa: String,
    anhBia: String,

    chuong: [chuongSchema],
    binhLuan: [binhLuanSchema],

    // ⭐ ĐÁNH GIÁ TRUYỆN
    danhGia: [danhGiaSchema],

    // 👑 ĐỀ CỬ / NỔI BẬT
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Truyen", truyenSchema);
