const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const truyenRoutes = require('./routes/truyen');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/truyen', truyenRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend Web Truyện chạy OK!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chạy tại cổng ${PORT}`);
});

const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);