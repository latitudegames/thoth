import { Route, Redirect } from 'wouter'

const GuardedRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    component={props =>
      auth ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
)

export default GuardedRoute
