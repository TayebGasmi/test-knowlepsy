const User = require('../models/User');
const {generateToken} = require('../utils/jwt');

class AuthService {
  async signup(userData) {
    const existingUser = await User.findOne({email: userData.email});

    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 400;
      throw error;
    }

    const user = new User(userData);
    await user.save();

    const token = generateToken({userId: user._id, email: user.email});

    return {
      user: user.toJSON(),
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({email}).select('+password');

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({userId: user._id, email: user.email});

    return {
      user: user.toJSON(),
      token
    };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user.toJSON();
  }
}

module.exports = new AuthService();
