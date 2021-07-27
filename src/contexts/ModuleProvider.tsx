import { useContext, createContext } from "react";

const Context = createContext({

});

export const usePubSub = () => useContext(Context);

const ModuleProvider = ({ children }) => {

  const publicInterface = {

  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ModuleProvider;
