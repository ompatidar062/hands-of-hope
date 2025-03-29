const jwt = require("jsonwebtoken");

const authMiddleware = (options = {}) => {
  return (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    
    // Option to allow unauthorized requests (for auth-status endpoint)
    if (options.optional && !token) {
      req.user = null;
      return next();
    }

    if (!token) {
      return res.status(401).json({ 
        authenticated: false,
        message: "Unauthorized. Please sign in." 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded.id) {
        return res.status(403).json({ 
          authenticated: false,
          message: "Invalid token structure" 
        });
      }

      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      res.clearCookie('jwt'); // Clear invalid token
      
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ 
          authenticated: false,
          message: "Session expired. Please sign in again." 
        });
      }
      return res.status(403).json({ 
        authenticated: false,
        message: "Invalid token" 
      });
    }
  };
};

module.exports = authMiddleware;