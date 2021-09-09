const loadSpellModel = (db) => {
  const getUser = async (id) => {
    return db.user
      .findOne({
        selector: {
          id,
        },
      })
      .exec();
  };

  const createUser = async (id) => {
    return db.user.insert({ id });
  };

  const getOrCreate = async (id) => {
    try {
      let user = await getUser(id);
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
    const user = await getUser(id);

    return user.atomicUpdate((oldDoc) => {
      return { ...oldDoc, ...update };
    });
  };

  const setAuthData = async (id, authData) => {
    const user = await getUser(id);

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
