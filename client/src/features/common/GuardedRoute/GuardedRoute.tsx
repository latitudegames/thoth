import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthProvider'


const GuardedRoute = props => {
  const { user } = useAuth()

  const auth = user && user.accessToken

  return auth ? <Outlet /> : <Navigate to="/login" replace />
}

export default GuardedRoute
