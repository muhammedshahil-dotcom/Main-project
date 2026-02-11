import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Not authorized, token missing", 401);
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("_id role name email");
  if (!user) throw new AppError("User not found", 401);

  req.user = {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
  };

  next();
});

export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
};

// Backward compatible aliases for existing routes.
export const protect = verifyToken;
export const admin = verifyAdmin;
