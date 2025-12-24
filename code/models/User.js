const mongoose = require("mongoose");

/* =================================================
   LỊCH SỬ ĐỌC TRUYỆN
   - Lưu truyện đã đọc
   - lastReadAt để sắp xếp lịch sử
================================================= */
const historySchema = new mongoose.Schema(
  {
    // ID truyện đã đọc
    truyenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truyen",
      required: true,
    },

    // Thời điểm đọc gần nhất
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // không tạo _id cho mỗi item
);

/* =================================================
   USER
================================================= */
const userSchema = new mongoose.Schema(
  {
    /* ---------- THÔNG TIN CƠ BẢN ---------- */

    // Username dùng để đăng nhập & hiển thị
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
    },

    // ⭐ Email bắt buộc (login / reset / verify)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Mật khẩu đã hash
    password: {
      type: String,
      required: true,
    },

    /* ---------- PHÂN QUYỀN ---------- */

    // Role giữ lại để tương thích cũ (có thể bỏ sau)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ⭐ CẤP BẬC NGƯỜI DÙNG
    // 0: Độc giả | 1: Tác giả | 2: Admin
    capBac: {
      type: Number,
      default: 0,
    },

    // Đã xác minh email hay chưa
    verified: {
      type: Boolean,
      default: false,
    },

    /* ---------- THEO DÕI & LỊCH SỬ ---------- */

    // ⭐ Danh sách truyện đang theo dõi
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truyen",
      },
    ],

    // ⭐ Lịch sử đọc truyện
    history: [historySchema],
  },
  { timestamps: true } // createdAt / updatedAt
);

module.exports = mongoose.model("User", userSchema);
