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
      type: String,
      required: true,
    },

    capBac: {
      type: Number,
      default: 0, // 0 độc giả | 1 tác giả | 2 admin
    },

    noiDung: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BinhLuan", binhLuanSchema);
