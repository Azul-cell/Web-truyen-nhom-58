const mongoose = require("mongoose");

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

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    /* ===============================
       ⭐ TRUYỆN ĐANG THEO DÕI
    ================================ */
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truyen",
      },
    ],

    /* ===============================
       ⭐ LỊCH SỬ ĐỌC TRUYỆN
    ================================ */
    history: [historySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
