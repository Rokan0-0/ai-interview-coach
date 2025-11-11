// In server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;

  // 1. Check for the token in the 'Authorization' header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token string (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user from the token's ID
      // We also remove the password from the object we get back
      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, createdAt: true, role: true },
      });

      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      // 5. Token is valid! Call the *next* function in the chain (our route handler)
      return next();

    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  // No token provided
  return res.status(401).json({ error: 'Not authorized, no token' });
};

export { protect };