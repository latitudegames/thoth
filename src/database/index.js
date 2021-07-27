// eslint-disable-next-line no-unused-vars
import { createRxDatabase, addRxPlugin, removeRxDatabase } from "rxdb";
import spellCollection from "./schemas/spell";
import settingsCollection from "./schemas/settings";
import tabCollection from "./schemas/tab";
import moduleCollection from "./schemas/module";

import loadSpellModel from "./models/spellModel";

addRxPlugin(require("pouchdb-adapter-idb"));

let database = null;
const databaseName = "thoth_alpha";
const adapter = "idb";

export const loadModels = (db) => {
  return {
    spells: loadSpellModel(db),
  };
};

export const initDB = async () => {
  if (database !== null) return database;

  // Uncomment this for fast deletion of DB
  if (process.env.NODE_ENV !== "production") {
    // await removeRxDatabase(databaseName, adapter);
  }

  database = await createRxDatabase({
    name: databaseName, // <- name
    adapter: adapter, // <- storage-adapter
  });

  const mergeCollections = (collectionArr) =>
    collectionArr.reduce((acc, collection) => ({ ...acc, ...collection }), {});

  const collections = [
    spellCollection,
    settingsCollection,
    tabCollection,
    moduleCollection,
  ];

  await database.addCollections(mergeCollections(collections));

  // middleware hooks
  database.spells.preInsert((doc) => {
    doc.createdAt = Date.now();
  }, false);

  database.spells.preSave((doc) => {
    doc.updatedAt = Date.now();
  }, false);

  database.tabs.preInsert(async (doc) => {
    if (doc.active) {
      const query = database.tabs
        .find()
        .where("active")
        .eq(true)
        .and([
          {
            id: {
              $ne: doc.id,
            },
          },
        ]);

      await query.update({
        $set: {
          active: false,
        },
      });

      return doc;
    }
  }, true);

  database.tabs.preSave(async (doc) => {
    if (doc.active) {
      const query = database.tabs
        .find()
        .where("active")
        .eq(true)
        .and([
          {
            id: {
              $ne: doc.id,
            },
          },
        ]);

      await query.update({
        $set: {
          active: false,
        },
      });

      return doc;
    }
  }, true);

  return database;
};
