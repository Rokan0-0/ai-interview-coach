// In server/middleware/adminMiddleware.js

const adminProtect = async (req, res, next) => {
  // Check if user exists and has admin role
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }

  // If not admin, return 403 Forbidden
  return res.status(403).json({ error: 'Not authorized as an admin.' });
};

export { adminProtect };

