import { Route, Redirect } from "wouter";

const GuardedRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    component={(props) =>
      auth === true ? <Component {...props} /> : <Redirect to="/" />
    }
  />
);

export default GuardedRoute;
