import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'

import {eventsApi} from '../store/api/eventsApi'
import {EventCard} from '../components/EventCard'
import {ErrorMessage} from '../components/ErrorMessage'

export const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user)

  const {
    data: eventsData,
    isLoading: eventsLoading
  } = eventsApi.useGetEventsQuery({limit: 6})

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError
  } = eventsApi.useGetEventStatsQuery()

  const recentEvents = eventsData?.data?.events || []
  const stats = statsData?.data?.overview || {}
  const eventsByMonth = statsData?.data?.eventsByMonth || []

  const chartData = eventsByMonth.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    events: item.count
  }))

  const StatCard = ({title, value, icon, color = 'primary'}) => (
      <div className="card p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
          </div>
        </div>
      </div>
  )

  return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your events.
          </p>
        </div>

        {statsError && (
            <ErrorMessage
                message="Failed to load statistics"
                className="mb-8"
            />
        )}

        {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({length: 4}, (_, i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                  title="Total Events"
                  value={stats.totalEvents || 0}
                  color="primary"
                  icon={
                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  }
              />

              <StatCard
                  title="Upcoming Events"
                  value={stats.upcomingEvents || 0}
                  color="green"
                  icon={
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  }
              />

              <StatCard
                  title="Past Events"
                  value={stats.pastEvents || 0}
                  color="gray"
                  icon={
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  }
              />

              <StatCard
                  title="Total Attendees"
                  value={stats.totalAttendees || 0}
                  color="purple"
                  icon={
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  }
              />
            </div>
        )}

        {chartData.length > 0 && (
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Events by Month
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600"/>
                    <XAxis
                        dataKey="month"
                        className="text-gray-600 dark:text-gray-400"
                        tick={{fontSize: 12}}
                    />
                    <YAxis
                        className="text-gray-600 dark:text-gray-400"
                        tick={{fontSize: 12}}
                    />
                    <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgb(31, 41, 55)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                    />
                    <Bar
                        dataKey="events"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Recent Events
          </h2>
          <Link
              to="/events"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
          >
            View all events
          </Link>
        </div>

        {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length: 6}, (_, i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
              ))}
            </div>
        ) : recentEvents.length === 0 ? (
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
                No events yet
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                  <EventCard key={event._id} event={event}/>
              ))}
            </div>
        )}
      </div>
  )
}
