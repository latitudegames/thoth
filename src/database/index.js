import { createRxDatabase, addRxPlugin } from "rxdb";
import spellSchema from "./schemas/spell";
import settingsSchema from "./schemas/settings";
import tabSchema from "./schemas/tab";

addRxPlugin(require("pouchdb-adapter-idb"));

let database = null;

export const initDB = async () => {
  if (database !== null) return database;

  database = await createRxDatabase({
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
    tabs: {
      schema: tabSchema,
    },
  });

  return database;
};
