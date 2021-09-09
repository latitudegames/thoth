import React from "react";

const Context = React.createContext({
  login: () => {},
  user: () => {},
  authHeader: () => {},
});

export const useAuth = () => React.useContext(Context);

const AuthProvider = ({ children }) => {
  const login = () => {};

  const user = () => {};

  const authHeader = () => {};

  const publicInterface = {
    login,
    user,
    authHeader,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default AuthProvider;
