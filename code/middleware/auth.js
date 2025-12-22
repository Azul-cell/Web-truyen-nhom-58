const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_secret_key";

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // ⭐ GÁN RÕ RÀNG
    req.user = {
      userId: decoded.userId,
      username: decoded.username, // ⭐ QUAN TRỌNG
      role: decoded.role,
    };
  } catch (err) {
    req.user = null;
  }

  next();
};
