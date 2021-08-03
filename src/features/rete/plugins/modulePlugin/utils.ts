import { Input, Output } from "rete";
import { socketNameMap } from "../../sockets";

export function extractNodes(nodes, map) {
  const names = Array.from(map.keys());

  return Object.keys(nodes)
    .filter((k) => names.includes(nodes[k].name))
    .map((k) => nodes[k])
    .sort((n1, n2) => n1.position[1] - n2.position[1]);
}

const getRemovedSockets = (existingSockets, newSockets) => {
  return existingSockets.filter(
    (existing) =>
      !newSockets.some((incoming) => incoming.socketKey === existing)
  );
};

const removeSockets = (node, sockets, type, editor) => {
  sockets.forEach(({ name: key, socket }) => {
    const connections = node
      .getConnections()
      .filter((con) => con[type].key === key);

    if (connections)
      connections.forEach((con) => {
        editor.removeConnection(con);
      });

    node.removeInput(socket);
  });
};

// here we can only remove the inputs and outputs that are not supposed to be on the node.
// This means we determine which IO are present on the node but not in the incoming IO
export function removeIO(node, editor, inputs, outputs) {
  const existingInputs = node.data.inputs.map((input) => input.name);
  const existingOutputs = node.data.outputs.map((output) => output.name);
  const inputRemovals = getRemovedSockets(existingInputs, inputs);
  const outputRemovals = getRemovedSockets(existingOutputs, outputs);

  removeSockets(node, inputRemovals, "input", editor);
  removeSockets(node, outputRemovals, "output", editor);
}

// here we will find any uncoming IO not already present on the node and add them
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
