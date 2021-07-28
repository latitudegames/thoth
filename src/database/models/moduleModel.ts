import { v4 as uuidv4 } from "uuid";

const loadModuleModel = (db) => {
  const getModules = async (callback) => {
    const query = db.modules.find();
    return callback ? query.$.subscribe(callback) : query.exec();
  };

  const getModule = async (moduleId) => {
    return db.modules
      .findOne({
        selector: {
          id: moduleId,
        },
      })
      .exec();
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
  };
};
export default loadModuleModel;
