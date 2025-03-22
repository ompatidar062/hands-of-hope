const { body, validationResult } = require("express-validator");

// * Centralized error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// * Validation rules for Sign Up
const validateSignUp = [
    body("name")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Name should be 3 to 50 characters long.")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Name should contain only alphabets and spaces."),
    
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Invalid email format."),
    
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long.")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage("Password must include at least 1 letter and 1 number."),
    
    body("role")
        .isIn(["healthcare", "learner", "volunteer", "donor"])
        .withMessage("Invalid role selected."),

    handleValidationErrors
];

// * Validation rules for Sign In
const validateSignIn = [
    body("email").trim().normalizeEmail().isEmail().withMessage("Invalid email format."),
    body("password").notEmpty().withMessage("Password cannot be empty."),
    handleValidationErrors
];

// * Validation rules for Contact Form
const validateContactForm = [
    body("name")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Name should be 3 to 50 characters long.")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Name should contain only alphabets and spaces."),
    
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Invalid email format."),
    
    body("message")
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage("Message should be between 10 to 1000 characters."),

    handleValidationErrors
];

module.exports = { validateSignUp, validateSignIn, validateContactForm };
