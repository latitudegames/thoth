import { createRxDatabase, addRxPlugin } from "rxdb";
import spellSchema from "./schemas/spell";
import settingsSchema from "./schemas/settings";

addRxPlugin(require("pouchdb-adapter-idb"));

export const initDB = async () => {
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

  return database;
};
