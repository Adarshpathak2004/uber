const express = require('express');
const captainController = require('../controllers/captain.controller');
const router = express.Router();
const authmiddleware = require('../middleware/auth.middleware');
const { body } = require('express-validator');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Vehicle plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'bike', 'auto']).withMessage('Vehicle type must be one of car, bike, auto'),

],
captainController.registerCaptain);
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
   
    captainController.loginCaptain
);


router.get('/profile', authmiddleware.authcaptain,captainController.getCaptainProfile);
router.get('/logout', authmiddleware.authcaptain, captainController.logoutCaptain);
module.exports = router;


