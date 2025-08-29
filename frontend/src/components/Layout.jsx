import { useSelector } from 'react-redux'
import { Header } from './Header'

export const Layout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthenticated && <Header />}
      <main className={isAuthenticated ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  )
}
