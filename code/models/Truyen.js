const mongoose = require("mongoose");

/* =================================================
   BÌNH LUẬN
   - Lưu trực tiếp trong truyện
   - Có capBac để hiển thị 👤 ✍️ 👑
================================================= */
const binhLuanSchema = new mongoose.Schema(
  {
    // ID người bình luận
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Username hiển thị (snapshot)
    username: {
      type: String,
      required: true,
    },

    // 0: độc giả | 1: tác giả | 2: admin
    capBac: {
      type: Number,
      default: 0,
    },

    // Nội dung bình luận
    noiDung: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* =================================================
   CHƯƠNG TRUYỆN
================================================= */
const chuongSchema = new mongoose.Schema(
  {
    soChuong: {
      type: Number,
      required: true,
    },

    tieuDe: {
      type: String,
      required: true,
    },

    noiDung: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* =================================================
   ĐÁNH GIÁ (SAO)
================================================= */
const danhGiaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // cấp bậc lúc đánh giá
    capBac: {
      type: Number,
      default: 0,
    },

    // số sao 1–5
    soSao: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

/* =================================================
   TRUYỆN
================================================= */
const truyenSchema = new mongoose.Schema(
  {
    /* ---------- THÔNG TIN CƠ BẢN ---------- */

    tenTruyen: {
      type: String,
      required: true,
      trim: true,
    },

    // Tên tác giả HIỂN THỊ (user nhập khi đăng)
    tacGia: {
      type: String,
      required: true,
      trim: true,
    },

    // ⭐ ID người đăng truyện (so quyền sửa/xoá)
    tacGiaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ⭐ cấp bậc lúc đăng (1: tác giả, 2: admin)
    capBacTacGia: {
      type: Number,
      default: 1,
    },

    theLoai: {
      type: [String],
      default: [],
    },

    moTa: {
      type: String,
      default: "",
    },

    anhBia: {
      type: String,
      default: "",
    },

    /* ---------- NỘI DUNG ---------- */

    // Danh sách chương
    chuong: [chuongSchema],

    // Bình luận
    binhLuan: [binhLuanSchema],

    // Đánh giá sao
    danhGia: [danhGiaSchema],

    /* ---------- TRẠNG THÁI ---------- */

    // Admin đánh dấu nổi bật
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Truyen", truyenSchema);
