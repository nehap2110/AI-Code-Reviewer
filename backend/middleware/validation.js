const { body, validationResult } = require("express-validator");
const { MIN_PASSWORD_LENGTH, MAX_CODE_SIZE, MIN_CODE_SIZE } = require("../constants");

const { AppError } = require("../utils/errorHandler");


/**
 * Validation middleware factory
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({ field: err.param, message: err.msg })),
    });
  }
  next();
};

/**
 * Auth validation rules
 */
const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .toLowerCase(),
  body("password")
    .isLength({ min: MIN_PASSWORD_LENGTH })
    .withMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage("Password must contain uppercase, lowercase, number, and special character"),
  validate,
];

const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email address").toLowerCase(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

/**
 * Code review validation rules
 */
const validateReview = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: MIN_CODE_SIZE, max: MAX_CODE_SIZE })
    .withMessage(`Code must be between ${MIN_CODE_SIZE} and ${MAX_CODE_SIZE} characters`),
  body("language")
    .optional()
    .isIn(["javascript", "python", "java", "cpp", "c", "ruby", "go", "rust", "typescript"])
    .withMessage("Invalid programming language"),
  body("action")
    .optional()
    .isIn(["review", "explain", "fixBugs", "optimize", "generateTests"])
    .withMessage("Invalid action"),
  validate,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateReview,
  validate,
};
