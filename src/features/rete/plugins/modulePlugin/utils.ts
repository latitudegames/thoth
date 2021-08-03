import { Input, Output } from "rete";
import { socketNameMap } from "../../sockets";
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

export function addIO(node, inputs, outputs, triggerOuts, triggerIns) {
  const uniqueInputsCount = new Set(inputs.map((i) => i.name)).size;
  const uniqueOutputsCount = new Set(outputs.map((i) => i.name)).size;
  const uniqueTriggerOutsCount = new Set(triggerOuts.map((i) => i.name)).size;
  const uniqueTriggerInsCount = new Set(triggerIns.map((i) => i.name)).size;

  if (uniqueInputsCount !== inputs.length)
    throw new Error(`Module ${node.data.module} has duplicate inputs`);
  if (uniqueOutputsCount !== outputs.length)
    throw new Error(`Module ${node.data.module} has duplicate outputs`);
  if (uniqueTriggerOutsCount !== triggerOuts.length)
    throw new Error(`Module ${node.data.module} has duplicate trigger outs`);
  if (uniqueTriggerInsCount !== triggerIns.length)
    throw new Error(`Module ${node.data.module} has duplicate trigger ins`);

  if (!node.data.inputs) node.data.inputs = [];
  if (!node.data.outputs) node.data.outputs = [];

  // handle writing these to the nodes data so spell refresh doesnt ruin connections
  inputs.forEach((i) => {
    node.addInput(new Input(i.name, i.name, i.socket));
    node.data.inputs.push({
      name: i.name,
      socketKey: i.name,
      connectionType: "input",
      socketType: socketNameMap[i.socket.name],
    });
  });
  triggerIns.forEach((i) => {
    node.addInput(new Input(i.name, i.name, i.socket));
    node.data.inputs.push({
      name: i.name,
      socketKey: i.name,
      connectionType: "input",
      socketType: socketNameMap[i.socket.name],
    });
  });
  outputs.forEach((o) => {
    node.addOutput(new Output(o.name, o.name, o.socket));
    node.data.outputs.push({
      name: o.name,
      taskType: "output",
      socketKey: o.name,
      connectionType: "output",
      socketType: socketNameMap[o.socket.name],
    });
  });
  triggerOuts.forEach((o) => {
    node.addOutput(new Output(o.name, o.name, o.socket));
    node.data.outputs.push({
      name: o.name,
      taskType: "option",
      socketKey: o.name,
      connectionType: "output",
      socketType: socketNameMap[o.socket.name],
    });
  });
}
