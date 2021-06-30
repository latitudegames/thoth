const defaultSpell = {
  _id: "defaultSpell",
  graph: {
    id: "demo@0.1.0",
    nodes: {
      1: {
        id: 1,
        data: { text: "Input text here", undefined: "Sam" },
        inputs: {},
        outputs: {
          text: { connections: [{ node: 12, input: "name", data: {} }] },
        },
        position: [74.40924045994934, 79.08276852760682],
        name: "Input",
      },
      9: {
        id: 9,
        data: { display: "true" },
        inputs: {
          string: { connections: [{ node: 13, output: "text", data: {} }] },
          data: { connections: [{ node: 13, output: "data", data: {} }] },
        },
        outputs: {
          boolean: { connections: [{ node: 11, input: "boolean", data: {} }] },
          data: { connections: [{ node: 11, input: "data", data: {} }] },
        },
        position: [-199.3843239822832, -205.0910954299351],
        name: "Safety Verifier",
      },
      11: {
        id: 11,
        data: {},
        inputs: {
          boolean: { connections: [{ node: 9, output: "boolean", data: {} }] },
          data: { connections: [{ node: 9, output: "data", data: {} }] },
        },
        outputs: {
          true: { connections: [{ node: 12, input: "data", data: {} }] },
          false: { connections: [] },
        },
        position: [99.11344037443256, -410.6986301163858],
        name: "Boolean Gate",
      },
      12: {
        id: 12,
        data: { display: "Joe walks into the bar." },
        inputs: {
          data: { connections: [{ node: 11, output: "true", data: {} }] },
          text: { connections: [{ node: 13, output: "text", data: {} }] },
          name: { connections: [{ node: 1, output: "text", data: {} }] },
        },
        outputs: { action: { connections: [] }, data: { connections: [] } },
        position: [426.32063666846057, -244.95964440421992],
        name: "Tense Transformer",
      },
      13: {
        id: 13,
        data: {},
        inputs: {},
        outputs: {
          text: {
            connections: [
              { node: 9, input: "string", data: {} },
              { node: 12, input: "text", data: {} },
            ],
          },
          data: { connections: [{ node: 9, input: "data", data: {} }] },
        },
        position: [-567.2821504111539, -206.93077213491136],
        name: "Console Input",
      },
    },
  },
  gameState: {
    history: [],
    name: [],
  },
};

export default defaultSpell;
