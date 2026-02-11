import AppError from "../utils/appError.js";

export const validateRequest = (schema) => (req, res, next) => {
  const errors = [];

  Object.entries(schema).forEach(([key, rule]) => {
    const value = req.body[key];

    if (rule.required && (value === undefined || value === null || value === "")) {
      errors.push(`${key} is required`);
      return;
    }

    if (value !== undefined && rule.type && typeof value !== rule.type) {
      errors.push(`${key} must be a ${rule.type}`);
      return;
    }

    if (value !== undefined && rule.minLength && String(value).trim().length < rule.minLength) {
      errors.push(`${key} must be at least ${rule.minLength} characters`);
    }
  });

  if (errors.length) {
    return next(new AppError(errors.join(", "), 400));
  }

  next();
};
