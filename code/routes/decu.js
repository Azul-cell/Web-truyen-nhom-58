/* =================================================
   PATCH /api/decu/:id
   👑 ADMIN BẬT / TẮT ĐỀ CỬ
   ⭐ GIỚI HẠN SỐ LƯỢNG
================================================= */
router.patch("/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    /* ==== 1. KIỂM TRA ID ==== */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }

    /* ==== 2. KIỂM TRA DỮ LIỆU ==== */
    if (typeof featured !== "boolean") {
      return res.status(400).json({
        message: "featured phải là boolean",
      });
    }

    /* ==== 3. NẾU BẬT ĐỀ CỬ → KIỂM TRA GIỚI HẠN ==== */
    if (featured === true) {
      const countFeatured = await Truyen.countDocuments({
        featured: true,
      });

      if (countFeatured >= MAX_DECU) {
        return res.status(400).json({
          message: `Chỉ được tối đa ${MAX_DECU} truyện đề cử`,
        });
      }
    }

    /* ==== 4. UPDATE TRUYỆN ==== */
    const truyen = await Truyen.findByIdAndUpdate(
      id,
      { featured },
      { new: true }
    );

    if (!truyen) {
      return res.status(404).json({
        message: "Không tìm thấy truyện",
      });
    }

    /* ==== 5. TRẢ KẾT QUẢ ==== */
    res.json({
      success: true,
      message: featured
        ? "Đã đưa vào Thư Viện Đề Cử"
        : "Đã bỏ khỏi Thư Viện Đề Cử",
      truyen,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
});
