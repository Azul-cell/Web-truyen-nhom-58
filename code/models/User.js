const mongoose = require("mongoose");

/* ================= LỊCH SỬ ĐỌC ================= */
const historySchema = new mongoose.Schema(
  {
    truyenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truyen",
      required: true,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* ================= USER ================= */
const userSchema = new mongoose.Schema(
  {
    /* ===== THÔNG TIN ===== */
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ===== PHÂN QUYỀN ===== */
    capBac: {
      type: Number, // 0: user | 1: author | 2: admin
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    // ⭐ BẮT BUỘC – BAN / UNBAN
    banned: {
      type: Boolean,
      default: false,
    },

    /* ===== THEO DÕI ===== */
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truyen",
      },
    ],

    history: [historySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
