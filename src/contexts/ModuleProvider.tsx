import { useContext, createContext, useState, useEffect } from "react";
import { useSnackbar } from "notistack";

import { useDB } from "./DatabaseProvider";

const Context = createContext({
  modules: [] as any[],
  saveModule: () => {},
  getModule: () => {},
  getSpellModules: () => {},
} as any);

export const useModule = () => useContext(Context);

const ModuleProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [modules, setModules] = useState([] as any[]);
  const { models } = useDB();

  // subscribe to all modules in the database
  useEffect(() => {
    if (!models) return;
    let subscription;

    (async () => {
      subscription = await models.modules.getModules((results) => {
        if (!results) return;
        setModules(results.map((module) => module.toJSON()) as any[]);
      });
    })();

    return () => {
      if (subscription.unsubscribe) subscription.unsubscribe();
    };
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

  const getModule = async (moduleName) => {
    return models.modules.findOneModule({ name: moduleName });
  };

  const getSpellModules = async (spell) => {
    // should actually look for spells that have a data.module key set to a string
    const moduleNames = Object.values(spell.graph.nodes)
      .filter((n: any) => n.name === "Module")
      .map((n: any) => n.data.name);

    const moduleDocs = await Promise.all(
      moduleNames.map((moduleName) => getModule(moduleName))
    );

    return moduleDocs.map((module) => module.toJSON());
  };

  const publicInterface = {
    modules,
    saveModule,
    getModule,
    getSpellModules,
    ...models.modules,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ModuleProvider;
