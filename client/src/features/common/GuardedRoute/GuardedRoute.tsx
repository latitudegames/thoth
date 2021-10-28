import { Route, Redirect } from 'react-router-dom'

import { useAuth } from '../../../contexts/AuthProvider'

const GuardedRoute = props => {
  const { user } = useAuth()

  const auth = user && user.accessToken

  return auth ? <Route {...props} /> : <Redirect to="/login" />
}

export default GuardedRoute
