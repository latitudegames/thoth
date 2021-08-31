const moduleSchema = {
  title: "Module schema",
  version: 1,
  description:
    "A module is a self contained spell chain which can act as a component inside another spell chain.",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string",
      primary: true,
    },
    data: {
      type: "object",
      default: { id: "demo@0.1.0", nodes: {} },
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
};

export type Module = {
  id: String;
  name: string;
  data: object;
  createdAt: number;
  updatedAt: number;
};

const collection = {
  modules: {
    schema: moduleSchema,
    migrationStrategies: {
      1: function (oldDoc) {
        return oldDoc;
      },
    },
  },
};

export default collection;
