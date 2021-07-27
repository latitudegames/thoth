import { useContext, createContext, useState, useEffect } from "react";
import { useDB } from './DatabaseProvider';

const Context = createContext({
  modules: [],
  newModule: () => {}
});

export const usePubSub = () => useContext(Context);

const ModuleProvider = ({ children }) => {
  const [modules, setModules] = useState([])
  const { models } = useDB();

  // subscribe to all modules in the database
  useEffect(() => {
    if (!models) return;

    models.modules.getModules((results => {
      if (!results) return;
      setModules(results.map(module => module.toSJON()))
    }))
  }, [models])

  const publicInterface = {
    modules,
    ...models.modules
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ModuleProvider;
