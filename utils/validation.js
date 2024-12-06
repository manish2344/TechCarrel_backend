const { body, validationResult } = require('express-validator');

exports.registerValidation = [
  body('username').not().isEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').not().isEmpty().withMessage('Password is required')
];

exports.productValidation = [
  body('name').not().isEmpty().withMessage('Product name is required'),
  body('description').not().isEmpty().withMessage('Product description is required'),
  body('startingPrice')
    .isFloat({ min: 0 }).withMessage('Starting price must be a positive number')
];

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};