const authService = require('../services/authService');

class AuthController {
  async signup(req, res, next) {
    try {
      const result = await authService.signup(req.body);
      
      res.status(201).json({
        message: 'User created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getUserProfile(req.user._id);
      
      res.json({
        message: 'Profile retrieved successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
