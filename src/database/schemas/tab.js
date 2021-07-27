const tabSchema = {
  title: "Tab schema",
  version: 1,
  description:
    "Tabs are a high level form of organization and represent a discrete workspace in thoth.",
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true,
    },
    name: {
      type: "string",
    },
    active: {
      type: "boolean",
      default: false,
    },
    layoutJson: {
      type: "object",
    },
    type: {
      type: "string",
    },
    spell: {
      ref: "spell",
      type: "string",
    },
    module: {
      ref: "module",
      type: "string",
    },
  },
};

const collection = {
  tabs: {
    schema: tabSchema,
    migrationStrategies: {
      1: function (oldDoc) {
        return oldDoc;
      },
    },
  },
};

export default collection;
