import { v4 as uuidv4 } from 'uuid'

const loadModuleModel = db => {
  const getModules = async callback => {
    const query = db.modules.find()
    return callback ? query.$.subscribe(callback) : await query.exec()
  }

  const getModule = async (moduleName, callback = null) => {
    const query = db.modules.findOne({
      selector: {
        name: moduleName,
      },
    })
    return callback ? query.$.subscribe(callback) : await query.exec()
  }

  const findOneModule = async (_query, callback = null) => {
    const query = await db.modules.findOne({
      selector: _query,
    })

    return callback ? query.$.subscribe(callback) : query.exec()
  }

  const updateModule = async (moduleName: string, update: object) => {
    const module = await getModule(moduleName)

    // eslint-disable-next-line
    console.log('module', module)

    return await module.atomicUpdate(oldData => {
      return {
        ...oldData,
        ...update,
      }
    })
  }

  const updateOrCreate = async doc => {
    let existing = await getModule(doc.name)

    if (!existing) {
      existing = await insert(doc)
    } else {
      const moduleName = doc.name
      // avoid conflict
      delete doc.name
      existing = await updateModule(moduleName, doc)
    }

    return existing
  }

  const insert = async doc => {
    if (!doc.id) doc.id = uuidv4()
    return await db.modules.insert(doc)
  }

  const newModule = async ({ name }) => {
    const newModule = {
      name,
      id: uuidv4(),
    }

    return await db.modules.insert(newModule)
  }

  return {
    insert,
    getModules,
    getModule,
    newModule,
    updateModule,
    findOneModule,
    updateOrCreate,
  }
}
export default loadModuleModel
