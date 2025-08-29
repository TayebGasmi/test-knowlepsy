import {useNavigate, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import toast from 'react-hot-toast'

import {eventsApi} from '../store/api/eventsApi'
import {formatDateTime, getRelativeDate, isEventPast} from '../utils/dateUtils'
import {LoadingSpinner} from '../components/LoadingSpinner'
import {ErrorMessage} from '../components/ErrorMessage'

export const EventDetailPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.user)

  const {
    data,
    isLoading,
    error
  } = eventsApi.useGetEventQuery(id)

  const [deleteEvent, {isLoading: isDeleting}] = eventsApi.useDeleteEventMutation()

  const event = data?.data?.event

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    try {
      await deleteEvent(id).unwrap()
      toast.success('Event deleted successfully')
      navigate('/events')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete event')
    }
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="large"/>
        </div>
    )
  }

  if (error) {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <ErrorMessage
              message={error?.data?.message || 'Failed to load event'}
          />
        </div>
    )
  }

  if (!event) {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Event not found
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The event you're looking for doesn't exist.
            </p>
            <button
                onClick={() => navigate('/events')}
                className="mt-4 btn-primary"
            >
              Back to Events
            </button>
          </div>
        </div>
    )
  }

  const isPast = isEventPast(event.date)
  const isOrganizer = currentUser?._id === event.organizer?._id
  const availableSpots = event.availableSpots || (event.capacity - (event.attendees?.length || 0))

  return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Events
          </button>
        </div>

        <div className="card p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mr-4">
                  {event.title}
                </h1>
                {isPast && (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  Past Event
                </span>
                )}
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {event.description}
              </p>
            </div>

            {isOrganizer && (
                <div className="ml-6 flex space-x-2">
                  <button
                      onClick={handleDeleteEvent}
                      disabled={isDeleting}
                      className="btn-danger flex items-center"
                  >
                    {isDeleting ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2"/>
                          Deleting...
                        </>
                    ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          Delete Event
                        </>
                    )}
                  </button>
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Event Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {getRelativeDate(event.date)}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <time dateTime={event.date}>
                          {formatDateTime(event.date)}
                        </time>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Location
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Capacity
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {availableSpots} / {event.capacity} spots available
                      </p>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${((event.capacity - availableSpots) / event.capacity) * 100}%`
                            }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Organizer
                </h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-lg font-medium">
                    {event.organizer?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {event.organizer?.name || 'Unknown'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {event.organizer?.email || 'No email available'}
                    </p>
                  </div>
                </div>
              </div>

              {event.attendees && event.attendees.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Attendees ({event.attendees.length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {event.attendees.map((attendee, index) => (
                          <div key={attendee._id || index} className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          {attendee.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {attendee.name || 'Unknown'}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {attendee.email || 'No email'}
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Created on {formatDateTime(event.createdAt)} •
              Last updated {formatDateTime(event.updatedAt)}
            </div>
          </div>
        </div>
      </div>
  )
}
