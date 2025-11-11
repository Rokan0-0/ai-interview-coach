// In server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  // 1. Check for the token in the 'Authorization' header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  // 2. Extract the token string (format: "Bearer <token>")
  const token = authHeader.split(' ')[1];

  // Security: Ensure token exists after split
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, invalid token format' });
  }

  // Security: Ensure JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 3. Verify the token using our secret
    // jwt.verify will throw an error if token is invalid, expired, or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Security: Ensure decoded token has userId
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Not authorized, invalid token payload' });
    }

    // 4. Find the user from the token's ID
    // Database query is inside try-catch to handle any database errors
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, createdAt: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    // 5. Attach user to request object and proceed
    req.user = user;
    return next();

  } catch (error) {
    // Handle JWT-specific errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Not authorized, invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Not authorized, token expired' });
    }
    if (error.name === 'PrismaClientKnownRequestError') {
      console.error('Database error in auth middleware:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Generic error handling
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Not authorized, token verification failed' });
  }
};

export { protect };