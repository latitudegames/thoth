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

    const updatedModule = await module.atomicUpdate(oldData => {
      return {
        ...oldData,
        ...update,
      }
    })

    return updatedModule
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

  const getSpellModules = async spell => {
    // should actually look for spells that have a data.module key set to a string
    const moduleNames = Object.values(spell.chain.graph.nodes)
      .filter((n: any) => n.name === 'Module')
      .map((n: any) => n.data.name)

    const moduleDocs = await Promise.all(
      moduleNames.map(moduleName => getModule(moduleName))
    )

    // todo need tobe recursive probably.  Or we add the modules used to the spell when created?

    return moduleDocs.map(module => module.toJSON())
  }

  return {
    insert,
    getModules,
    getModule,
    newModule,
    updateModule,
    findOneModule,
    updateOrCreate,
    getSpellModules,
  }
}
export default loadModuleModel
