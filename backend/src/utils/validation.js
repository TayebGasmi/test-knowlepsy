const { z } = require('zod');

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be less than 2000 characters'),
  date: z.string().refine((date) => {
    const eventDate = new Date(date);
    return eventDate > new Date() && !isNaN(eventDate.getTime());
  }, 'Event date must be in the future'),
  location: z.string().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').max(10000, 'Capacity must be less than 10000')
});

const eventQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional()
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({
        message: 'Validation error',
        errors: errorMessages
      });
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({
        message: 'Query validation error',
        errors: errorMessages
      });
    }
  };
};

module.exports = {
  signupSchema,
  loginSchema,
  eventSchema,
  eventQuerySchema,
  validateRequest,
  validateQuery
};
