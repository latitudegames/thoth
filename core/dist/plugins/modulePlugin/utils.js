import { Input, Output } from "rete";
import { socketNameMap } from "../../sockets";
export function extractNodes(nodes, map) {
    var names = Array.from(map.keys());
    return Object.keys(nodes)
        .filter(function (k) { return names.includes(nodes[k].name); })
        .map(function (k) { return nodes[k]; })
        .sort(function (n1, n2) { return n1.position[1] - n2.position[1]; });
}
var getRemovedSockets = function (existingSockets, newSockets) {
    return existingSockets.filter(function (existing) {
        return !newSockets.some(function (incoming) { return incoming.socketKey === existing.socketKey; });
    });
};
var removeSockets = function (node, sockets, type, editor) {
    sockets.forEach(function (socket) {
        var connections = node.getConnections().filter(function (con) {
            // cant use key to compare because it changes by user preference
            // unchanging key but mutable name? or add new id property to things?
            return (con.input.key === socket.socketKey ||
                con.output.key === socket.socketKey);
        });
        if (connections)
            connections.forEach(function (con) {
                editor.removeConnection(con);
            });
        // need to get the socket from the node first since this isnt the sockey object
        var removeMethod = type === "input" ? "removeInput" : "removeOutput";
        var removedSocket = node[type + "s"].get(socket.socketKey);
        if (removedSocket)
            node[removeMethod](removedSocket);
        node.data[type + "s"] = node.data[type + "s"].filter(function (soc) { return soc.socketKey !== socket.socketKey; });
    });
};
var updateSockets = function (node, sockets, taskType) {
    if (taskType === void 0) { taskType = "output"; }
    sockets.forEach(function (_a) {
        var socketKey = _a.socketKey, name = _a.name;
        if (node.inputs.has(socketKey)) {
            var input = node.inputs.get(socketKey);
            input.name = name;
            node.inputs.set(socketKey, input);
            // Update the nodes data sockets as well
            node.data.inputs = node.data.inputs.map(function (n) {
                if (n.socketKey === socketKey) {
                    n.name = name;
                }
                return n;
            });
        }
        if (node.outputs.has(socketKey)) {
            var output = node.outputs.get(socketKey);
            output.name = name;
            node.outputs.set(socketKey, output);
            node.data.outputs = node.data.outputs.map(function (n) {
                if (n.socketKey === socketKey) {
                    n.name = name;
                }
                return n;
            });
        }
    });
};
var addSockets = function (node, sockets, connectionType, taskType) {
    if (taskType === void 0) { taskType = "output"; }
    var uniqueCount = new Set(sockets.map(function (i) { return i.name; })).size;
    var existingSockets = node.data[connectionType + "s"].map(function (soc) { return soc.socketKey; });
    if (uniqueCount !== sockets.length)
        throw new Error("Module " + node.data.module + " has duplicate " + (taskType === "option" ? "trigger" : "") + " " + connectionType + "s");
    updateSockets(node, sockets, taskType);
    var newSockets = sockets.filter(function (socket) { return !existingSockets.includes(socket.socketKey); });
    if (newSockets.length > 0)
        newSockets.forEach(function (newSocket, i) {
            var name = newSocket.name, socket = newSocket.socket, socketKey = newSocket.socketKey;
            var Socket = connectionType === "output" ? Output : Input;
            var addMethod = connectionType === "output" ? "addOutput" : "addInput";
            node.data[connectionType + "s"].push({
                name: name,
                taskType: taskType,
                socketKey: socketKey,
                connectionType: connectionType,
                socketType: socketNameMap[socket.name],
            });
            node[addMethod](new Socket(socketKey, name, socket));
            if (connectionType === "output")
                node.inspector.component.task.outputs[socketKey] = taskType;
        });
};
export function addIO(node, inputs, outputs, triggerOuts, triggerIns) {
    if ((inputs === null || inputs === void 0 ? void 0 : inputs.length) > 0)
        addSockets(node, inputs, "input");
    if ((triggerIns === null || triggerIns === void 0 ? void 0 : triggerIns.length) > 0)
        addSockets(node, triggerIns, "input", "option");
    if ((outputs === null || outputs === void 0 ? void 0 : outputs.length) > 0)
        addSockets(node, outputs, "output");
    if ((triggerOuts === null || triggerOuts === void 0 ? void 0 : triggerOuts.length) > 0)
        addSockets(node, triggerOuts, "output", "option");
}
// here we can only remove the inputs and outputs that are not supposed to be on the node.
// This means we determine which IO are present on the node but not in the incoming IO
export function removeIO(node, editor, inputs, outputs) {
    var existingInputs = node.data.inputs;
    var existingOutputs = node.data.outputs;
    var inputRemovals = getRemovedSockets(existingInputs, inputs);
    var outputRemovals = getRemovedSockets(existingOutputs, outputs);
    if (inputRemovals.length > 0)
        removeSockets(node, inputRemovals, "input", editor);
    if (outputRemovals.length > 0)
        removeSockets(node, outputRemovals, "output", editor);
}
