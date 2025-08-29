const express = require('express');
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');
const { validateRequest, validateQuery, eventSchema, eventQuerySchema } = require('../utils/validation');

const router = express.Router();

router.use(authenticate);

router.post('/', validateRequest(eventSchema), eventController.createEvent);
router.get('/', validateQuery(eventQuerySchema), eventController.getEvents);
router.get('/stats', eventController.getEventStats);
router.get('/:id', eventController.getEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
