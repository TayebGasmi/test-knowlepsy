import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { eventsApi } from '../store/api/eventsApi'
import { EventCard } from '../components/EventCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

export const EventsPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    location: '',
    startDate: '',
    endDate: '',
    search: '',
  })

  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = eventsApi.useGetEventsQuery(filters)

  const [deleteEvent] = eventsApi.useDeleteEventMutation()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      location: '',
      startDate: '',
      endDate: '',
      search: '',
    },
  })

  const onSubmit = (data) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      ...data,
    }))
  }

  const handleClearFilters = () => {
    reset()
    setFilters({
      page: 1,
      limit: 12,
      location: '',
      startDate: '',
      endDate: '',
      search: '',
    })
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      await deleteEvent(eventId).unwrap()
      toast.success('Event deleted successfully')
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete event')
    }
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }))
  }

  const events = data?.data?.events || []
  const pagination = data?.data?.pagination || {}

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Events
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover and manage events
          </p>
        </div>
        <Link
          to="/events/create"
          className="btn-primary"
        >
          Create Event
        </Link>
      </div>

      <div className="card p-6 mb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="form-label">
                Search
              </label>
              <input
                {...register('search')}
                type="text"
                className="form-input"
                placeholder="Search events..."
              />
            </div>
            
            <div>
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                {...register('location')}
                type="text"
                className="form-input"
                placeholder="Filter by location"
              />
            </div>

            <div>
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                {...register('startDate')}
                type="date"
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
              <input
                {...register('endDate')}
                type="date"
                className="form-input"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {error && (
        <ErrorMessage 
          message={error?.data?.message || 'Failed to load events'} 
          className="mb-8"
        />
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No events found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating your first event.
          </p>
          <div className="mt-6">
            <Link
              to="/events/create"
              className="btn-primary"
            >
              Create Event
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={handleDeleteEvent}
                showActions={true}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * filters.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * filters.limit, pagination.totalEvents)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.totalEvents}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + Math.max(1, pagination.currentPage - 2)
                      if (page > pagination.totalPages) return null
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-600 dark:hover:bg-gray-700 ${
                            page === pagination.currentPage
                              ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
