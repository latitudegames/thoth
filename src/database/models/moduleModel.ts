const loadModuleModel = db => {
  const getModules = async (callback) => {
    const query = db.modules.find()
    return callback ? query.$.subscribe(callback) : query.exec()
  }

  return {
    getModules
  }
}
export default loadModuleModel;