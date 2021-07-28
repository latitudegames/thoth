const moduleSchema = {
  title: "Module schema",
  version: 0,
  description:
    "A module is a self contained spell chain which can act as a component inside another spell chain.",
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true,
    },
    name: {
      type: "string",
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

const collection = {
  modules: {
    schema: moduleSchema,
  },
};

export default collection;
