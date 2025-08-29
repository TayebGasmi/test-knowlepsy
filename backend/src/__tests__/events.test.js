const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Event = require('../models/Event');
const { generateToken } = require('../utils/jwt');

describe('Event Endpoints', () => {
  let user;
  let token;

  beforeEach(async () => {
    user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    await user.save();
    
    token = generateToken({ userId: user._id, email: user.email });
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'This is a test event',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Test Location',
        capacity: 100
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send(eventData)
        .expect(201);

      expect(response.body.message).toBe('Event created successfully');
      expect(response.body.data.event.title).toBe(eventData.title);
    });

    it('should not create event without authentication', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'This is a test event',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Test Location',
        capacity: 100
      };

      await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(401);
    });

    it('should not create event with past date', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'This is a test event',
        date: new Date(Date.now() - 86400000).toISOString(),
        location: 'Test Location',
        capacity: 100
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send(eventData)
        .expect(400);

      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/events', () => {
    beforeEach(async () => {
      const events = [
        {
          title: 'Event 1',
          description: 'Description 1',
          date: new Date(Date.now() + 86400000),
          location: 'Location 1',
          capacity: 100,
          organizer: user._id
        },
        {
          title: 'Event 2',
          description: 'Description 2',
          date: new Date(Date.now() + 172800000),
          location: 'Location 2',
          capacity: 200,
          organizer: user._id
        }
      ];

      await Event.insertMany(events);
    });

    it('should get all events', async () => {
      const response = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Events retrieved successfully');
      expect(response.body.data.events).toHaveLength(2);
      expect(response.body.data.pagination.totalEvents).toBe(2);
    });

    it('should filter events by location', async () => {
      const response = await request(app)
        .get('/api/events?location=Location 1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0].location).toBe('Location 1');
    });
  });

  describe('DELETE /api/events/:id', () => {
    let event;

    beforeEach(async () => {
      event = new Event({
        title: 'Test Event',
        description: 'This is a test event',
        date: new Date(Date.now() + 86400000),
        location: 'Test Location',
        capacity: 100,
        organizer: user._id
      });
      await event.save();
    });

    it('should delete own event', async () => {
      const response = await request(app)
        .delete(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Event deleted successfully');

      const deletedEvent = await Event.findById(event._id);
      expect(deletedEvent).toBeNull();
    });

    it('should not delete non-existent event', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .delete(`/api/events/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
