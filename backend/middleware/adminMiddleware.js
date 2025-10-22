// Simple admin check — requires authMiddleware to set req.user
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    next();
  } catch (err) {
    console.error("adminMiddleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminMiddleware;
