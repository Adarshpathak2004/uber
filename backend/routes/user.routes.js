const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('fullname.firstname').isLength({ min: 5 }).withMessage('First name must be at least 5 characters long'),
    body('fullname.lastname').isLength({ min: 5 }).withMessage('Last name must be at least 5 characters long'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  userController.registeruser
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  userController.loginuser
);

router.get(
  '/profile',
  authMiddleware.authuser,
  userController.getUserProfile
);

router.get('/logout', authMiddleware.authuser, userController.logoutUser);

module.exports = router;
