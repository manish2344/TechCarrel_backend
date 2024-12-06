const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure this path is correct

// Middleware to verify if the user is authenticated
const authenticate = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the token's payload
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = user;

    next(); // Call the next middleware or controller
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = authenticate;
