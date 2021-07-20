import { useContext, createContext, useState, useEffect } from "react";
import { initDB } from "../database";

import LoadingScreen from "../features/common/LoadingScreen/LoadingScreen";

const Context = createContext({
  db: {},
});

export const useDB = () => useContext(Context);

const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(false);

  useEffect(() => {
    (async () => {
      if (db) return;

      const database = await initDB();

      setDb(database);
    })();
  }, [db]);

  const publicInterface = {
    db,
  };

  if (!db) return <LoadingScreen />;

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default DatabaseProvider;
