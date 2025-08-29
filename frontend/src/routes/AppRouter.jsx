import {Navigate, Route, Routes} from 'react-router-dom'
import {useSelector} from 'react-redux'

import {LoginPage} from '../pages/LoginPage'
import {SignupPage} from '../pages/SignupPage'
import {DashboardPage} from '../pages/DashboardPage'
import {EventsPage} from '../pages/EventsPage'
import {CreateEventPage} from '../pages/CreateEventPage'
import {EventDetailPage} from '../pages/EventDetailPage'

const ProtectedRoute = ({children}) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  return isAuthenticated ? children : <Navigate to="/login" replace/>
}

const PublicRoute = ({children}) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace/>
}

export const AppRouter = () => {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace/>}/>

        <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage/>
              </PublicRoute>
            }
        />

        <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage/>
              </PublicRoute>
            }
        />

        <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage/>
              </ProtectedRoute>
            }
        />

        <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage/>
              </ProtectedRoute>
            }
        />

        <Route
            path="/events/create"
            element={
              <ProtectedRoute>
                <CreateEventPage/>
              </ProtectedRoute>
            }
        />

        <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetailPage/>
              </ProtectedRoute>
            }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
      </Routes>
  )
}
