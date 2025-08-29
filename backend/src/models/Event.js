const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 10000
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'published'
  }
}, {
  timestamps: true
});

eventSchema.index({date: 1});
eventSchema.index({location: 1});
eventSchema.index({organizer: 1});
eventSchema.index({title: 'text', description: 'text'});

eventSchema.virtual('availableSpots').get(function () {
  return this.capacity - this.attendees.length;
});

eventSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Event', eventSchema);
