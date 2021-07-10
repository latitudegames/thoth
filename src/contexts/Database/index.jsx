import { useContext, createContext, useState, useEffect } from "react";
import { createRxDatabase, addRxPlugin } from "rxdb";

import LoadingScreen from "../../features/common/LoadingScreen/LoadingScreen";
import spellSchema from "./schemas/spell";
import settingsSchema from "./schemas/settings";

addRxPlugin(require("pouchdb-adapter-idb"));

const Context = createContext({
  db: {},
});

export const useDB = () => useContext(Context);

const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(false);

  useEffect(() => {
    (async () => {
      if (db) return;

      const database = await createRxDatabase({
        name: "thoth_alpha", // <- name
        adapter: "idb", // <- storage-adapter
      });

      await database.addCollections({
        spells: {
          schema: spellSchema,
        },
        settings: {
          schema: settingsSchema,
        },
      });

      console.log(database);

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
