const spellSchema = {
  title: "Spell schema",
  version: 0,
  description:
    "Spells contain the rete chain json, as well as other information on a particular chain.",
  type: "object",
  properties: {
    name: {
      type: "string",
      primary: true,
    },
    graph: {
      type: "object",
    },
    gameState: {
      type: "object",
      default: {},
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
  spells: {
    schema: spellSchema,
  },
};

export default collection;
