import jwt from 'jsonwebtoken';
import { User } from '../Model/user.model.js';

export const verifyToken = async (req, res, next) => {
  let token;

  // 1. Check if token exists in Headers (Authorization: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (excluding password) and attach to req object
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next function (the controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};