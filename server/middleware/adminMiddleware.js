// In server/middleware/adminMiddleware.js

const adminProtect = async (req, res, next) => {
  // Security: Ensure user is authenticated first
  // This middleware should ALWAYS be used after the protect middleware
  if (!req.user) {
    // If user is not set, it means protect middleware wasn't called or failed
    // Return 401 Unauthorized (not authenticated) rather than 403 (not authorized)
    return res.status(401).json({ error: 'Not authenticated. Please log in first.' });
  }

  // Security: Explicitly check for ADMIN role
  // Check for exact string match and handle null/undefined cases
  const userRole = req.user.role;
  
  if (userRole === 'ADMIN') {
    return next();
  }

  // User is authenticated but not an admin
  // Return 403 Forbidden (authenticated but not authorized)
  return res.status(403).json({ 
    error: 'Access denied. Administrator privileges required.' 
  });
};

export { adminProtect };

