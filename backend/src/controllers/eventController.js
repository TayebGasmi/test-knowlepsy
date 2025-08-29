const eventService = require('../services/eventService');

class EventController {
  async createEvent(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body, req.user._id);

      res.status(201).json({
        message: 'Event created successfully',
        data: {event}
      });
    } catch (error) {
      next(error);
    }
  }

  async getEvents(req, res, next) {
    try {
      const result = await eventService.getEvents(req.query, req.user._id);

      res.json({
        message: 'Events retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getEvent(req, res, next) {
    try {
      const event = await eventService.getEventById(req.params.id);

      res.json({
        message: 'Event retrieved successfully',
        data: {event}
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const result = await eventService.deleteEvent(req.params.id, req.user._id);

      res.json({
        message: 'Event deleted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventStats(req, res, next) {
    try {
      const stats = await eventService.getEventStats(req.user._id);

      res.json({
        message: 'Event statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
