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
    tab: {
      ref: "tab",
      type: "string",
    },
    graph: {
      type: "object",
    },
    gameState: {
      type: "object",
    },
  },
};

export default spellSchema;
