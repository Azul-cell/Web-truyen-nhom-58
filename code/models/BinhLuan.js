const mongoose = require("mongoose");

const binhLuanSchema = new mongoose.Schema(
  {
    truyenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truyen",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String, // ⭐ HIỂN THỊ TÊN
      required: true,
    },
    noiDung: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BinhLuan", binhLuanSchema);
