const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth Endpoints', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
      .post('/api/auth/signup')
      .send(userData)
      .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not create user with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
      .post('/api/auth/signup')
      .send(userData)
      .expect(400);

      expect(response.body.message).toBe('Validation error');
    });

    it('should not create user with existing email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await User.create(userData);

      const response = await request(app)
      .post('/api/auth/signup')
      .send(userData)
      .expect(400);

      expect(response.body.message).toBe('User already exists with this email');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
      await user.save();
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
