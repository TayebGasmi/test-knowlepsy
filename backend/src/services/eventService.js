const Event = require('../models/Event');

class EventService {
  async createEvent(eventData, organizerId) {
    const event = new Event({
      ...eventData,
      organizer: organizerId,
      date: new Date(eventData.date)
    });

    await event.save();
    await event.populate('organizer', 'name email');
    
    return event;
  }

  async getEvents(query, userId) {
    const {
      page = 1,
      limit = 10,
      location,
      startDate,
      endDate,
      search
    } = query;

    const filter = { status: 'published' };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('organizer', 'name email')
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(filter)
    ]);

    return {
      events,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalEvents: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async getEventById(eventId) {
    const event = await Event.findById(eventId)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }

    return event;
  }

  async deleteEvent(eventId, userId) {
    const event = await Event.findById(eventId);

    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }

    if (event.organizer.toString() !== userId.toString()) {
      const error = new Error('Not authorized to delete this event');
      error.statusCode = 403;
      throw error;
    }

    await Event.findByIdAndDelete(eventId);
    return { message: 'Event deleted successfully' };
  }

  async getEventStats(userId) {
    const stats = await Event.aggregate([
      { $match: { organizer: userId } },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalAttendees: { $sum: { $size: '$attendees' } },
          upcomingEvents: {
            $sum: { $cond: [{ $gt: ['$date', new Date()] }, 1, 0] }
          },
          pastEvents: {
            $sum: { $cond: [{ $lte: ['$date', new Date()] }, 1, 0] }
          }
        }
      }
    ]);

    const eventsByMonth = await Event.aggregate([
      { $match: { organizer: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return {
      overview: stats[0] || {
        totalEvents: 0,
        totalAttendees: 0,
        upcomingEvents: 0,
        pastEvents: 0
      },
      eventsByMonth
    };
  }
}

module.exports = new EventService();
