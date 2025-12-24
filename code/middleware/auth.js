const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_secret_key"; // lát nữa sẽ đưa vào .env

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role, // user | admin
      capBac: decoded.capBac, // ⭐ 0: độc giả | 1: tác giả | 2: admin
    };
  } catch (err) {
    req.user = null;
  }

  next();
};
