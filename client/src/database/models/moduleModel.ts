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

  const getNestedModules = async (moduleNames: string[]) => {
    const moduleDocs = await Promise.all(
      moduleNames.map(moduleName => getModule(moduleName))
    )
    if (moduleDocs.length === 0) return []
    const modules = moduleDocs.filter(Boolean).map(module => module.toJSON())
    const nestedModules = await Promise.all(
      modules.map(async module => {
        const nestedModuleNames = Object.values(module.data.nodes)
          .filter((n: any) => n.data.module)
          .map((n: any) => n.data.module)
        if (nestedModuleNames.length === 0) {
          return []
        } else {
          const nextModuleLayer = await getNestedModules(nestedModuleNames)
          return nextModuleLayer.flat()
        }
      })
    )
    const allModules = modules.concat(nestedModules.flat())
    console.log('all nested modules flattened', allModules)
    return allModules
  }

  const getSpellModules = async spell => {
    const moduleNames = Object.values(spell.chain.nodes)
      .filter((n: any) => n.data.module)
      .map((n: any) => n.data.module)

    await getNestedModules(moduleNames)
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
