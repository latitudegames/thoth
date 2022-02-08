import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthProvider'


const GuardedRoute = props => {
  const { user } = useAuth()

  const auth = user && user.accessToken
  if (process.env.USE_LATITUDE !== "true")
    return <Outlet />
  return auth ? <Outlet /> : <Navigate to="/login" replace />
}

export default GuardedRoute
