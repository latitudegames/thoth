import { Input, Output } from "rete";
export function extractNodes(nodes, map) {
  const names = Array.from(map.keys());

  return Object.keys(nodes)
    .filter((k) => names.includes(nodes[k].name))
    .map((k) => nodes[k])
    .sort((n1, n2) => n1.position[1] > n2.position[1]);
}

export function removeIO(node, editor) {
  node.getConnections().forEach((c) => editor.removeConnection(c));
  Array.from(node.inputs.values()).forEach((input) => node.removeInput(input));
  Array.from(node.outputs.values()).forEach((output) =>
    node.removeOutput(output)
  );
}

export function addIO(node, inputs, outputs, triggers) {
  const uniqueInputsCount = new Set(inputs.map((i) => i.name)).size;
  const uniqueOutputsCount = new Set(outputs.map((i) => i.name)).size;
  const uniqueTriggersCount = new Set(triggers.map((i) => i.name)).size;

  if (uniqueInputsCount !== inputs.length)
    throw new Error(`Module ${node.data.module} has duplicate inputs`);
  if (uniqueOutputsCount !== outputs.length)
    throw new Error(`Module ${node.data.module} has duplicate outputs`);
  if (uniqueTriggersCount !== triggers.length)
    throw new Error(`Module ${node.data.module} has duplicate triggers`);

  inputs.forEach((i) => node.addInput(new Input(i.name, i.name, i.socket)));
  outputs.forEach((o) => node.addOutput(new Output(o.name, o.name, o.socket)));
  triggers.forEach((o) => node.addOutput(new Output(o.name, o.name, o.socket)));
}
