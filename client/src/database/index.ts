/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { createRxDatabase, addRxPlugin } from 'rxdb'

import loadModuleModel from './models/moduleModel'
import userModel from './models/userModel'
import moduleCollection from './schemas/module'
import settingsCollection from './schemas/settings'
import tabCollection from './schemas/tab'
import userCollection from './schemas/user'

// eslint-disable-next-line @typescript-eslint/no-var-requires
addRxPlugin(require('pouchdb-adapter-idb'))

type Database = {
  addCollections: Function
  tabs: Record<string, any>
}

type DatabaseReturn = {
  database: Database
  models: Record<string, any>
}

let databaseReturn: DatabaseReturn | null = null
let database: null | Database = null
const databaseName = 'thoth_alpha'
const adapter = 'idb'

export const initDB = async () => {
  if (databaseReturn !== null) return databaseReturn

  // Uncomment this for fast deletion of DB
  if (process.env.NODE_ENV !== 'production') {
    // await removeRxDatabase(databaseName, adapter)
  }

  database = (await createRxDatabase({
    name: databaseName, // <- name
    adapter: adapter, // <- storage-adapter
  })) as Database

  if (!database) return

  const mergeCollections = collectionArr =>
    collectionArr.reduce((acc, collection) => ({ ...acc, ...collection }), {})

  const collections = [
    settingsCollection,
    tabCollection,
    moduleCollection,
    userCollection,
  ]

  await database.addCollections(mergeCollections(collections))

  // middleware hooks
  database.tabs.preInsert(async doc => {
    if (doc.active) {
      const query = database?.tabs
        .find()
        .where('active')
        .eq(true)
        .and([
          {
            id: {
              $ne: doc.id,
            },
          },
        ])

      await query.update({
        $set: {
          active: false,
        },
      })

      return doc
    }
  }, true)

  database.tabs.preSave(async doc => {
    if (doc.active) {
      const query = database?.tabs
        .find()
        .where('active')
        .eq(true)
        .and([
          {
            id: {
              $ne: doc.id,
            },
          },
        ])

      await query.update({
        $set: {
          active: false,
        },
      })

      return doc
    }
  }, true)

  const models = {
    modules: loadModuleModel(database),
    user: userModel(database),
  }

  databaseReturn = {
    database,
    models,
  }

  return databaseReturn
}
