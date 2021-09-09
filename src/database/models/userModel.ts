const loadSpellModel = (db) => {
  const getUserById = async (id) => {
    return db.user
      .findOne({
        selector: {
          id,
        },
      })
      .exec();
  };

  const getUser = async () => {
    const userDocs = await db.user.find().exec();

    return userDocs.length > 0 ? userDocs[0].toJSON() : null;
  };

  const createUser = async (id) => {
    return db.user.insert({ id });
  };

  const getOrCreate = async (id) => {
    try {
      let user = await getUserById(id);
      if (!user) {
        user = await createUser(id);
      }

      return user;
    } catch (err) {
      console.log("error creating user", err);
      return false;
    }
  };

  const updateUser = async (id, update) => {
    const user = await getUserById(id);

    return user.atomicUpdate((oldDoc) => {
      return { ...oldDoc, ...update };
    });
  };

  const setAuthData = async (id, authData) => {
    const user = await getUserById(id);

    return user.atomicUpdate((oldData) => {
      return {
        ...oldData,
        authData,
      };
    });
  };

  return {
    getUser,
    updateUser,
    setAuthData,
    getOrCreate,
  };
};

export default loadSpellModel;
