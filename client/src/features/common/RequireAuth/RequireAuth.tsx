import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthProvider'

const RequireAuth = (props: Record<string, any>) => {
  const { user } = useAuth()

  const auth = user && user.accessToken

  return auth ? <Outlet /> : <Navigate to="/login" />
}

export default RequireAuth
