const userSchema = {
  title: "user schema",
  version: 0,
  description: "The main user object",
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true,
    },
    authData: {
      type: "string",
    },
  },
};

const collection = {
  user: {
    schema: userSchema,
  },
};

export default collection;
