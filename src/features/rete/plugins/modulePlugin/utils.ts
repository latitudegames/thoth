import { Input, Output } from "rete";

import { socketNameMap } from "../../sockets";
import { ModuleSocketType } from "./module-manager";

type DataSocketType = {
  name: string;
  taskType: "output" | "option";
  socketKey: string;
  connectionType: "input" | "output";
  socketType: "string";
};

export function extractNodes(nodes, map) {
  const names = Array.from(map.keys());

  return Object.keys(nodes)
    .filter((k) => names.includes(nodes[k].name))
    .map((k) => nodes[k])
    .sort((n1, n2) => n1.position[1] - n2.position[1]);
}

const getRemovedSockets = (
  existingSockets: DataSocketType[],
  newSockets: ModuleSocketType[]
) => {
  return existingSockets.filter(
    (existing) =>
      !newSockets.some((incoming) => incoming.socketKey === existing.socketKey)
  );
};

const removeSockets = (
  node,
  sockets: DataSocketType[],
  type: "input" | "output",
  editor
) => {
  sockets.forEach((socket) => {
    const connections = node.getConnections().filter((con) => {
      // cant use key to compare because it changes by user preference
      // unchanging key but mutable name? or add new id property to things?
      return (
        con.input.key === socket.socketKey ||
        con.output.key === socket.socketKey
      );
    });

    if (connections)
      connections.forEach((con) => {
        editor.removeConnection(con);
      });

    // need to get the socket from the node first since this isnt the sockey object

    const removedSocket = node[type + "s"].get(socket.socketKey);
    if (removedSocket) node.removeInput(removedSocket);
    node.data[type + "s"] = node.data[type + "s"].filter(
      (soc) => soc.socketKey !== socket.socketKey
    );
  });
};

const updateSockets = (
  node,
  sockets: ModuleSocketType[],
  taskType: "option" | "output" = "output"
) => {
  sockets.forEach(({ socketKey, name }) => {
    if (node.inputs.has(socketKey)) {
      const input = node.inputs.get(socketKey);
      input.name = name;
      node.inputs.set(socketKey, input);
      // Update the nodes data sockets as well
      node.data.inputs = node.data.inputs.map((n) => {
        if (n.socketKey === socketKey) {
          n.name = name;
        }

        return n;
      });
    }
    if (node.outputs.has(socketKey)) {
      const output = node.outputs.get(socketKey);
      output.name = name;
      node.outputs.set(socketKey, output);

      node.data.outputs = node.data.outputs.map((n) => {
        if (n.socketKey === socketKey) {
          n.name = name;
        }

        return n;
      });

      node.inspector.component.task.outputs[name] = taskType;
    }
  });
};

const addSockets = (
  node,
  sockets: ModuleSocketType[],
  connectionType: "input" | "output",
  taskType: "option" | "output" = "output"
) => {
  const uniqueCount = new Set(sockets.map((i) => i.name)).size;
  const existingSockets = node.data[connectionType + "s"].map(
    (soc: DataSocketType) => soc.socketKey
  );

  if (uniqueCount !== sockets.length)
    throw new Error(
      `Module ${node.data.module} has duplicate ${
        taskType === "option" ? "trigger" : ""
      } ${connectionType}s`
    );

  updateSockets(node, sockets, taskType);

  const newSockets = sockets.filter(
    (socket) => !existingSockets.includes(socket.socketKey)
  );

  if (newSockets.length > 0)
    newSockets.forEach((newSocket, i) => {
      const { name, socket, socketKey } = newSocket;

      const Socket = connectionType === "output" ? Output : Input;
      const addMethod = connectionType === "output" ? "addOutput" : "addInput";

      node.data[connectionType + "s"].push({
        name: name,
        taskType: taskType,
        socketKey: socketKey,
        connectionType: connectionType,
        socketType: socketNameMap[socket.name],
      });

      node[addMethod](new Socket(socketKey, name, socket));
      if (connectionType === "output")
        node.inspector.component.task.outputs[name] = taskType;
    });
};

export function addIO(
  node,
  inputs: ModuleSocketType[],
  outputs: ModuleSocketType[],
  triggerOuts: ModuleSocketType[],
  triggerIns: ModuleSocketType[]
) {
  if (inputs?.length > 0) addSockets(node, inputs, "input");
  if (triggerIns?.length > 0) addSockets(node, triggerIns, "input", "option");
  if (outputs?.length > 0) addSockets(node, outputs, "output");
  if (triggerOuts?.length > 0)
    addSockets(node, triggerOuts, "output", "option");
}

// here we can only remove the inputs and outputs that are not supposed to be on the node.
// This means we determine which IO are present on the node but not in the incoming IO
export function removeIO(
  node,
  editor,
  inputs: ModuleSocketType[],
  outputs: ModuleSocketType[]
) {
  const existingInputs = node.data.inputs;
  const existingOutputs = node.data.outputs;
  const inputRemovals = getRemovedSockets(existingInputs, inputs);
  const outputRemovals = getRemovedSockets(existingOutputs, outputs);

  if (inputRemovals.length > 0)
    removeSockets(node, inputRemovals, "input", editor);
  if (outputRemovals.length > 0)
    removeSockets(node, outputRemovals, "output", editor);
}
