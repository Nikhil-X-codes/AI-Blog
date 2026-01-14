import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, no token provided" 
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    req.userId = decoded.userId || decoded.id; 
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};
