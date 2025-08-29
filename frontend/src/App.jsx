import {useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {checkAuth} from './store/slices/authSlice'
import {AppRouter} from './routes/AppRouter'
import {Layout} from './components/Layout'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
      <Layout>
        <AppRouter/>
      </Layout>
  )
}

export default App
