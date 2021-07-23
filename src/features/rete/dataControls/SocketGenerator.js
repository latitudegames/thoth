import Rete from "rete";
import * as socketMap from "../sockets";

import { DataControl } from "../plugins/inspectorPlugin";

export class SocketGeneratorControl extends DataControl {
  constructor({
    socketType = "anySocket",
    taskType = "output",
    ignored = [],
    icon = "properties",
    connectionType,
    name: nameInput,
  }) {
    console.log("connection type", connectionType);
    if (
      !connectionType ||
      (connectionType !== "input" && connectionType !== "output")
    )
      throw new Error(
        "Direction of your generator must be defined and of the value 'input' or 'output'."
      );

    const name = nameInput || `Socket ${connectionType}s`;

    const options = {
      dataKey: connectionType + "s",
      name,
      component: "socketGenerator",
      icon,
      data: {
        ignored,
        socketType,
        taskType,
        connectionType,
      },
    };

    super(options);

    this.connectionType = connectionType;
  }

  onData(sockets = []) {
    // we assume all sockets are of the same type here
    // and that the data key is set to 'inputs' or 'outputs'
    this.node.data[this.dataKey] = sockets;

    const existingSockets = [];
    this.node[this.dataKey].forEach((out) => {
      existingSockets.push(out.key);
    });

    // get array of ignored socket names
    const ignored = this.control.data.ignored || [];
    // this?.control?.data?.ignored.map((socket) => socket.socketKey) || [];

    // Any outputs existing on the current node that arent incoming have been deleted
    // and need to be removed.
    existingSockets
      .filter(
        (existing) =>
          !sockets.some((incoming) => incoming.socketKey === existing)
      )
      .filter((existing) => ignored.some((socket) => socket !== existing))
      .forEach((key) => {
        const socket = this.node[this.dataKey].get(key);

        this.node
          .getConnections()
          .filter((con) => con[this.connectionType].key === key)
          .forEach((con) => {
            this.editor.removeConnection(con);
          });

        if (this.connectionType === "output") {
          this.node.removeOutput(socket);
        } else {
          console.log("SOCKET", socket);
          this.node.removeInput(socket);
        }
      });

    // any incoming outputs not already on the node are new and will be added.
    const newSockets = sockets.filter(
      (socket) => !existingSockets.includes(socket)
    );

    // Here we are running over and ensuring that the outputs are in the task
    // We only need to do this with outputs, as inputs don't need to be in the task
    if (this.dataKey === "outputs") {
      this.component.task.outputs = this.node.data.outputs.reduce(
        (acc, out) => {
          acc[out.socketKey] = out.taskType || "output";
          return acc;
        },
        { ...this.component.task.outputs }
      );
    }

    // From these new outputs, we iterate and add an output socket to the node
    newSockets.forEach((socket) => {
      const SocketConstructor =
        this.connectionType === "output" ? Rete.Output : Rete.Input;
      const newSocket = new SocketConstructor(
        socket.socketKey || socket.name.toLowerCase(),
        socket.name,
        socketMap[socket.socketType]
      );

      if (this.connectionType === "output") {
        this.node.addOutput(newSocket);
      } else {
        this.node.addInput(newSocket);
      }
    });

    this.node.update();
  }
}
