const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const emailValidator = (email) => {
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return emailRegex.test(email);
};

const validateUserRegistration = [
  check('username')
    .notEmpty().withMessage('Email is Required')
    .isEmail().withMessage('Invalid Email Format')
    .custom((value) => emailValidator(value))
    .withMessage('Invalid Email Format'),
  check('password')
    .notEmpty().withMessage('Password is Required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),
  check('ConfirmPassword')
    .notEmpty().withMessage('Confirm Password is Required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }).withMessage('Passwords do not match'),
];
const validateResetPassowrd = [
  check('username')
    .notEmpty().withMessage('Email is Required')
    .isEmail().withMessage('Invalid Email Format')
    .custom((value) => emailValidator(value))
    .withMessage('Invalid Email Format'),
]
const validateUserLogin = [
  check('username')
    .notEmpty().withMessage('Email is Required')
    .isEmail().withMessage('Invalid Email Format')
    .custom((value) => emailValidator(value))
    .withMessage('Invalid Email Format'),
  check('password')
    .notEmpty().withMessage('Password is Required')
]
const validateChangePassword = [
  check('password')
    .notEmpty().withMessage('Password is Required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),
  check('ConfirmPassword')
    .notEmpty().withMessage('Confirm Password is Required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }).withMessage('Passwords do not match'),
]

const validateCreateTodo = [
  check('title').notEmpty().withMessage('Title is Required'),
  check('description').notEmpty().withMessage('Description is Required')
]

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateResetPassowrd,
  validateChangePassword,
  validateCreateTodo,
  handleValidationErrors
};
