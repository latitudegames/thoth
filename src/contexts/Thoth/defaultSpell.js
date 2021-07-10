const defaultGraph = {
  id: "demo@0.1.0",
  nodes: {
    19: {
      id: 19,
      data: { text: "look around", display: "look around" },
      inputs: {},
      outputs: {
        text: { connections: [{ node: 20, input: "text", data: {} }] },
        data: { connections: [{ node: 20, input: "data", data: {} }] },
      },
      position: [-490.22096252441406, -39.029022216796875],
      name: "Playtest Input",
    },
    20: {
      id: 20,
      data: { display: "Joe looks around." },
      inputs: {
        data: { connections: [{ node: 19, output: "data", data: {} }] },
        text: { connections: [{ node: 19, output: "text", data: {} }] },
        name: { connections: [{ node: 21, output: "text", data: {} }] },
      },
      outputs: {
        action: { connections: [{ node: 22, input: "text", data: {} }] },
        data: { connections: [{ node: 22, input: "data", data: {} }] },
      },
      position: [-113.70181927025716, -40.976457966150136],
      name: "Tense Transformer",
    },
    21: {
      id: 21,
      data: { text: "Joe" },
      inputs: {},
      outputs: {
        text: { connections: [{ node: 20, input: "name", data: {} }] },
      },
      position: [-487.4524728901213, 177.47814817526412],
      name: "Input",
    },
    22: {
      id: 22,
      data: { display: "Joe looks around." },
      inputs: {
        text: { connections: [{ node: 20, output: "action", data: {} }] },
        data: { connections: [{ node: 20, output: "data", data: {} }] },
      },
      outputs: {},
      position: [254.06680252890246, -40.51955467684894],
      name: "Playtest Print",
    },
  },
};

const defaultSpell = {
  graph: defaultGraph,
  gameState: {
    history: [],
    name: [],
  },
};

export default defaultSpell;
