const express = require('express');
const authController = require('../controllers/authController');
const {authenticate} = require('../middleware/auth');
const {validateRequest, signupSchema, loginSchema} = require('../utils/validation');

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
