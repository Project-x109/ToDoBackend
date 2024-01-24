const secretKey = 'YourSuperSecretKeyHere1234567890';
const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized Error' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized Error' });
    }
    req.user = decoded;
    next();
  });
};
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};
module.exports = {
  verifyToken,
  isAuthenticated
};
