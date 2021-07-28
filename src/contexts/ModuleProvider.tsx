import { useContext, createContext, useState, useEffect } from "react";
import { useSnackbar } from "notistack";

import { useDB } from "./DatabaseProvider";

const Context = createContext({
  modules: [] as any[],
  saveModule: () => {},
} as any);

export const useModule = () => useContext(Context);

const ModuleProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
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

  const saveModule = async (moduleId, update, snack = true) => {
    try {
      const module = await models.modules.updateModule(moduleId, update);
      if (snack) enqueueSnackbar("Module saved");
      return module;
    } catch (err) {
      console.log("error saving module", module);
      if (snack) enqueueSnackbar("Error saving module");
    }
  };

  const publicInterface = {
    modules,
    saveModule,
    ...models.modules,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ModuleProvider;
