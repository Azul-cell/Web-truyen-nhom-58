const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const User = require("./models/User");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(authMiddleware);

/* ===== AUTH API ===== */
app.use("/api/auth", authRoute);

/* ===== TRUYỆN API ===== */
const truyenRoute = require("./routes/truyen");
app.use("/api/truyen", truyenRoute);

/* ===== BINH LUAN API ===== */
const binhLuanRouter = require("./routes/binhluan");
app.use("/api/binhluan", binhLuanRouter);

/* ===== FOLLOW API ===== */
const followRouter = require("./routes/follow");
app.use("/api/follow", followRouter);

/* ===== ME API ===== */
const meRouter = require("./routes/me");
app.use("/api/me", meRouter);

/* ===== DANH GIA API ===== */
const danhGiaRouter = require("./routes/danhgia");
app.use("/api/danhgia", danhGiaRouter);

/* ===== XEP HANG API ===== */
const xepHangRouter = require("./routes/xepHang");
app.use("/api/xephang", xepHangRouter);

/* ===== HISTORY API ===== */
const historyRouter = require("./routes/history");
app.use("/api/history", historyRouter);

/* ===== DE CU API ===== */
const decuRoutes = require("./routes/decu");
app.use("/api/decu", decuRoutes);

/* ===== ADMIN API ===== */
const adminRouter = require("./routes/admin");
app.use("/api/admin", adminRouter);

/* ===== CONNECT DB ===== */
mongoose
  .connect("mongodb://127.0.0.1:27017/truyen_db")
  .then(() => console.log("MongoDB connected"));

app.listen(4000, () => console.log("Server http://localhost:4000"));
