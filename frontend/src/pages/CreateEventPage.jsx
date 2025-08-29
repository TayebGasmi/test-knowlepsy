import {useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import {eventsApi} from '../store/api/eventsApi'
import {eventSchema} from '../utils/validation'
import {formatDateForInput} from '../utils/dateUtils'
import {LoadingSpinner} from '../components/LoadingSpinner'
import {ErrorMessage} from '../components/ErrorMessage'

export const CreateEventPage = () => {
  const navigate = useNavigate()
  const [createEvent, {isLoading, error}] = eventsApi.useCreateEventMutation()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: formatDateForInput(new Date(Date.now() + 86400000)),
      capacity: 50,
    },
  })

  const onSubmit = async (data) => {
    try {
      const eventData = {
        ...data,
        capacity: parseInt(data.capacity, 10),
      }

      const result = await createEvent(eventData).unwrap()
      toast.success('Event created successfully!')
      navigate(`/events/${result.data.event._id}`)
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create event')
    }
  }

  return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Event
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Fill in the details below to create your event.
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <ErrorMessage
                    message={error?.data?.message || 'Failed to create event'}
                />
            )}

            <div>
              <label htmlFor="title" className="form-label">
                Event Title *
              </label>
              <input
                  {...register('title')}
                  type="text"
                  className="form-input"
                  placeholder="Enter event title"
                  aria-invalid={errors.title ? 'true' : 'false'}
                  aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                  <p id="title-error" className="form-error">
                    {errors.title.message}
                  </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                  {...register('description')}
                  rows={4}
                  className="form-input"
                  placeholder="Describe your event..."
                  aria-invalid={errors.description ? 'true' : 'false'}
                  aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                  <p id="description-error" className="form-error">
                    {errors.description.message}
                  </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="form-label">
                  Date & Time *
                </label>
                <input
                    {...register('date')}
                    type="datetime-local"
                    className="form-input"
                    aria-invalid={errors.date ? 'true' : 'false'}
                    aria-describedby={errors.date ? 'date-error' : undefined}
                />
                {errors.date && (
                    <p id="date-error" className="form-error">
                      {errors.date.message}
                    </p>
                )}
              </div>

              <div>
                <label htmlFor="capacity" className="form-label">
                  Capacity *
                </label>
                <input
                    {...register('capacity', {valueAsNumber: true})}
                    type="number"
                    min="1"
                    max="10000"
                    className="form-input"
                    placeholder="Maximum attendees"
                    aria-invalid={errors.capacity ? 'true' : 'false'}
                    aria-describedby={errors.capacity ? 'capacity-error' : undefined}
                />
                {errors.capacity && (
                    <p id="capacity-error" className="form-error">
                      {errors.capacity.message}
                    </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="form-label">
                Location *
              </label>
              <input
                  {...register('location')}
                  type="text"
                  className="form-input"
                  placeholder="Event location or venue"
                  aria-invalid={errors.location ? 'true' : 'false'}
                  aria-describedby={errors.location ? 'location-error' : undefined}
              />
              {errors.location && (
                  <p id="location-error" className="form-error">
                    {errors.location.message}
                  </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                  type="button"
                  onClick={() => navigate('/events')}
                  className="btn-secondary"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center"
              >
                {isLoading ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2"/>
                      Creating...
                    </>
                ) : (
                    'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}
