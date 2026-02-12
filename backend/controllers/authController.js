import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { generateToken } from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) throw new AppError("User already exists", 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: sanitizeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 400);

  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: sanitizeUser(user),
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always return success-ish message to avoid email enumeration.
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = Date.now() + 15 * 60 * 1000;

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = expiresAt;
  await user.save();

  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${baseUrl}/reset-password/${rawToken}`;

  // Respond fast to reduce UI wait time; email is sent asynchronously.
  res.status(200).json({
    success: true,
    message: "If that email exists, a reset link has been sent.",
  });

  sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <p>Hello ${user.name || "User"},</p>
      <p>You requested a password reset. Click below to continue:</p>
      <a href="${resetLink}" style="display:inline-block;padding:10px 14px;background:#dc2626;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  }).catch((error) => {
    console.error("Forgot password email send failed:", error.message);
  });

  return;
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new AppError("Invalid or expired reset token", 400);

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});
