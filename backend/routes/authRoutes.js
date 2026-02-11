import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest({
    name: { required: true, type: "string", minLength: 2 },
    email: { required: true, type: "string", minLength: 5 },
    password: { required: true, type: "string", minLength: 6 },
  }),
  register
);

router.post(
  "/login",
  validateRequest({
    email: { required: true, type: "string", minLength: 5 },
    password: { required: true, type: "string", minLength: 6 },
  }),
  login
);

router.post(
  "/forgot-password",
  validateRequest({
    email: { required: true, type: "string", minLength: 5 },
  }),
  forgotPassword
);

router.post(
  "/reset-password/:token",
  validateRequest({
    password: { required: true, type: "string", minLength: 6 },
  }),
  resetPassword
);

export default router;
