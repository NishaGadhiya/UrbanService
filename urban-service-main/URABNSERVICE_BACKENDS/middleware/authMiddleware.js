const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let  token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decoded; // Attach user data to request
    next();
  });
};


module.exports = {verifyToken};
