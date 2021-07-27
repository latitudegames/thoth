import { useContext, createContext, useState, useEffect } from "react";
import { initDB, loadModels } from "../database";

import LoadingScreen from "../features/common/LoadingScreen/LoadingScreen";

const Context = createContext({
  db: {},
  models: {},
});

export const useDB = () => useContext(Context);

const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(false);
  const [models, setModels] = useState(false);

  useEffect(() => {
    (async () => {
      if (db) return;

      const database = await initDB();
      const models = loadModels(db);

      setDb(database);
      setModels(models);
    })();
  }, [db]);

  const publicInterface = {
    db,
    models,
  };

  if (!db && !models) return <LoadingScreen />;

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default DatabaseProvider;
