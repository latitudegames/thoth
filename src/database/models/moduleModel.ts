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

  const findOneModule = async (_query, callback = null) => {
    const query = await db.modules.findOne({
      selector: _query,
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

  const updateOrCreate = async (doc) => {
    let existing = await getModule(doc.id);

    if (!existing) {
      existing = await insert(doc);
    } else {
      const moduleId = doc.id;
      // avoid conflict
      delete doc.id;
      existing = await updateModule(moduleId, doc);
    }

    return existing;
  };

  const insert = async (doc) => {
    if (!doc.id) doc.id = uuidv4();
    return db.modules.insert(doc);
  };

  const newModule = async ({ name }) => {
    const newModule = {
      name,
      id: uuidv4(),
    };

    return db.modules.insert(newModule);
  };

  return {
    insert,
    getModules,
    getModule,
    newModule,
    updateModule,
    findOneModule,
    updateOrCreate,
  };
};
export default loadModuleModel;
