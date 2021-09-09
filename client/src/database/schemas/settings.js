const settingsSchema = {
  title: "Settings schema",
  version: 0,
  description: "All local settings for a users session",
  type: "object",
  properties: {
    name: {
      type: "string",
      primary: true,
    },
    currentSpell: {
      ref: "spell",
      type: "string",
    },
  },
};

const collection = {
  settings: {
    schema: settingsSchema,
  },
};

export default collection;
