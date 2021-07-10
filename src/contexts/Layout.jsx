import { useContext, createContext } from "react";
// import { useDB } from "./Database";

const Context = createContext({});

export const useLayout = () => useContext(Context);

const LayoutProvider = ({ children }) => {
  // const db = useDB();

  const publicInterface = {};

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default LayoutProvider;
