const mongoose = require("mongoose");

/* ===== LỊCH SỬ ĐỌC ===== */
const historySchema = new mongoose.Schema(
  {
    // truyện đã đọc
    truyenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truyen",
      required: true,
    },

    // lần đọc gần nhất
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // không cần id riêng
    _id: false,
  }
);

/* ===== USER ===== */
const userSchema = new mongoose.Schema(
  {
    // tên đăng nhập
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
    },

    // email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // mật khẩu
    password: {
      type: String,
      required: true,
    },

    /* ----- QUYỀN ----- */

    // 0: user | 1: tác giả | 2: admin
    capBac: {
      type: Number,
      default: 0,
    },

    // khoá tài khoản
    banned: {
      type: Boolean,
      default: false,
    },

    /* ----- DỮ LIỆU ----- */

    // truyện đang theo dõi
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truyen",
      },
    ],

    // lịch sử đọc
    history: [historySchema],
  },
  {
    // tự tạo thời gian
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
