const mongoose = require("mongoose");

// lưu thông tin bình luận của người dùng
const binhLuanSchema = new mongoose.Schema(
  {
    // id người dùng đã bình luận
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // tên hiển thị tại thời điểm bình luận
    username: {
      type: String,
      required: true,
    },

    // cấp bậc của user lúc bình luận
    // 0: độc giả | 1: tác giả | 2: admin
    capBac: {
      type: Number,
      default: 0,
    },

    // nội dung bình luận
    noiDung: {
      type: String,
      required: true,
    },
  },
  // thời gian tạo và cập nhật bình luận
  { timestamps: true }
);

// lưu thông tin các chương của truyện
const chuongSchema = new mongoose.Schema(
  {
    // số thứ tự chương
    soChuong: {
      type: Number,
      required: true,
    },

    // tiêu đề chương
    tieuDe: {
      type: String,
      required: true,
    },

    // nội dung chương
    noiDung: {
      type: String,
      required: true,
    },
  },
  // thời gian tạo và cập nhật chương
  { timestamps: true }
);

// lưu đánh giá sao của người dùng
const danhGiaSchema = new mongoose.Schema(
  {
    // id người đánh giá
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // cấp bậc của user lúc đánh giá
    capBac: {
      type: Number,
      default: 0,
    },

    // số sao (1 đến 5)
    soSao: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  // thời gian tạo và cập nhật đánh giá
  { timestamps: true }
);

// lưu thông tin truyện
const truyenSchema = new mongoose.Schema(
  {
    // tên truyện
    tenTruyen: {
      type: String,
      required: true,
      trim: true,
    },

    // tên tác giả hiển thị
    tacGia: {
      type: String,
      required: true,
      trim: true,
    },

    // id người đăng truyện
    tacGiaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // cấp bậc của user lúc đăng truyện
    // 1: tác giả | 2: admin
    capBacTacGia: {
      type: Number,
      default: 1,
    },

    // danh sách thể loại
    theLoai: {
      type: [String],
      default: [],
    },

    // mô tả truyện
    moTa: {
      type: String,
      default: "",
    },

    // link ảnh bìa
    anhBia: {
      type: String,
      default: "",
    },

    // danh sách chương
    chuong: [chuongSchema],

    // danh sách bình luận
    binhLuan: [binhLuanSchema],

    // danh sách đánh giá
    danhGia: [danhGiaSchema],

    // trạng thái truyện nổi bật
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  // thời gian tạo và cập nhật truyện
  { timestamps: true }
);

module.exports = mongoose.model("Truyen", truyenSchema);
