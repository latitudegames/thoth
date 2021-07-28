import { v4 as uuidv4 } from "uuid";

const loadModuleModel = (db) => {
  const getModules = async (callback) => {
    const query = db.modules.find();
    return callback ? query.$.subscribe(callback) : query.exec();
  };

  const getModule = async (moduleId, callback = null) => {
    const query = db.modules.findOne({
      selector: {
        id: moduleId,
      },
    });
    return callback ? query.$.subscribe(callback) : query.exec();
  };

  const updateModule = async (moduleId: string, update: object) => {
    const module = await getModule(moduleId);

    return module.atomicUpdate((oldData) => {
      return {
        ...oldData,
        ...update,
      };
    });
  };

  const newModule = ({ name }) => {
    const newModule = {
      name,
      id: uuidv4(),
    };

    return db.modules.insert(newModule);
  };

  return {
    getModules,
    getModule,
    newModule,
    updateModule,
  };
};
export default loadModuleModel;
