import { Route, Navigate } from 'react-router-dom'

import { useAuth } from '../../../contexts/AuthProvider'

const GuardedRoute = props => {
  const { user } = useAuth()

  const auth = user && user.accessToken

  return auth ? <Route {...props} /> : <Navigate to="/login" replace />
}

export default GuardedRoute
