import { Link } from 'react-router-dom'
import { formatDateTime, getRelativeDate, isEventPast } from '../utils/dateUtils'

export const EventCard = ({ event, onDelete, showActions = false }) => {
  const isPast = isEventPast(event.date)

  return (
    <div className={`card p-6 transition-all duration-200 hover:shadow-md ${isPast ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            <Link 
              to={`/events/${event._id}`}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              {event.title}
            </Link>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {event.description}
          </p>
        </div>
        
        {isPast && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            Past Event
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={event.date}>
            {getRelativeDate(event.date)} at {formatDateTime(event.date).split(' ').slice(-2).join(' ')}
          </time>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.location}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {event.availableSpots || event.capacity - (event.attendees?.length || 0)} / {event.capacity} spots available
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Organized by {event.organizer?.name || 'Unknown'}
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            <Link
              to={`/events/${event._id}`}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-200"
            >
              View Details
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(event._id)}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200"
                aria-label={`Delete ${event.title}`}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
