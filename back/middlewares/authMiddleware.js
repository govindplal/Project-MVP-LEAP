const jwt = require('jsonwebtoken');
require('dotenv').config();
// Middleware function to protect routes
const authMiddleware = (req, res, next) => {
  // Get the token from the request headers, cookies, or wherever you store it
  const token = req.body.headers.Authorization || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    req.user = decoded.user; // Attach the user data to the request
    next(); // Continue to the protected route
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { authMiddleware };
