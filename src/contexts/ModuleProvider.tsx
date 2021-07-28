import { useContext, createContext, useState, useEffect } from "react";
import { useDB } from "./DatabaseProvider";

const Context = createContext({
  modules: [] as any[],
  saveModule: () => {},
} as any);

export const useModule = () => useContext(Context);

const ModuleProvider = ({ children }) => {
  const [modules, setModules] = useState([] as any[]);
  const { models } = useDB();

  // subscribe to all modules in the database
  useEffect(() => {
    if (!models) return;

    models.modules.getModules((results) => {
      if (!results) return;
      setModules(results.map((module) => module.toJSON()) as any[]);
    });
  }, [models]);

  const publicInterface = {
    modules,
    ...models.modules,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ModuleProvider;
