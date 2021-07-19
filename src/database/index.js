// eslint-disable-next-line no-unused-vars
import { createRxDatabase, addRxPlugin, removeRxDatabase } from "rxdb";
import spellSchema from "./schemas/spell";
import settingsSchema from "./schemas/settings";
import tabSchema from "./schemas/tab";

addRxPlugin(require("pouchdb-adapter-idb"));

let database = null;
const databaseName = "thoth_alpha";
const adapter = "idb";

export const initDB = async () => {
  if (database !== null) return database;

  // Uncomment this for fast deletion of DB
  // await removeRxDatabase(databaseName, adapter);

  database = await createRxDatabase({
    name: databaseName, // <- name
    adapter: adapter, // <- storage-adapter
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

  // middleware hooks
  database.spells.preInsert((doc) => {
    doc.createdAt = Date.now();
  }, false);

  database.spells.preSave((doc) => {
    doc.updatedAt = Date.now();
  }, false);

  database.tabs.preInsert(async (doc) => {
    if (doc.active) {
      const active = await database.tabs
        .findOne({
          selector: { active: true },
        })
        .exec();

      if (!active) return;

      await active.atomicPatch({ active: false });
    }
  }, false);

  database.tabs.preSave(async (doc) => {
    if (doc.active) {
      const active = await database.tabs
        .findOne({
          selector: { active: true },
        })
        .exec();

      if (!active) return;

      await active.atomicPatch({ active: false });
    }
  }, false);

  return database;
};
