import { NodeData } from "rete/types/core/data";
import { Component } from "rete/types";

type TaskRef = {
  key: string;
  task: Task;
  run?: Function;
  next?: any[];
};

type TaskOptions = {
  outputs: object;
  init: Function;
  onRun: Function;
};

type RunOptions = {
  propagate?: boolean;
  needReset?: boolean;
  garbage?: Task[];
  fromSocket?: string;
};

// interface WorkerFunction {
//   inputs: object;
// }

interface IComponentWithTask extends Component {
  task: TaskOptions;
  _task: Task;
}

export class Task {
  node: NodeData;
  inputs: object;
  component: IComponentWithTask;
  worker: Function;
  next: TaskRef[];
  outputData: object | null;
  closed: string[];

  constructor(
    inputs: object,
    component: IComponentWithTask,
    node: NodeData,
    worker: Function
  ) {
    this.node = node;
    this.inputs = inputs;
    this.component = component;
    this.worker = worker;
    this.next = [];
    this.outputData = null;
    this.closed = [];

    this.getInputs("option").forEach((key) => {
      this.inputs[key].forEach((con) => {
        con.task.next.push({ key: con.key, task: this });
      });
    });
  }

  getInputs(type) {
    return Object.keys(this.inputs)
      .filter((key) => this.inputs[key][0])
      .filter((key) => this.inputs[key][0].type === type);
  }

  getInputFromConnection(socketKey) {
    let input: null | any = null;
    Object.entries(this.inputs).forEach(([key, value]) => {
      if (value.some((con) => con && con.key === socketKey)) {
        input = key;
      }
    });

    return input;
  }

  reset() {
    this.outputData = null;
  }

  async run(data: unknown = {}, options: RunOptions = {}) {
    const {
      needReset = true,
      garbage = [] as Task[],
      propagate = true,
      fromSocket,
    } = options;

    if (needReset) garbage.push(this);

    // This would be a great place to run an animation showing the signal flow.
    // Just needto figure out how to change the folow of the connection attached to a socket on the fly.
    // And animations should follow the flow of the data, not the main IO paths

    if (!this.outputData) {
      const inputs = {};

      // here we run through all INPUTS connected to other OUTPUTS for the node.
      // We run eachinput back to whatever node it is connected to.
      // We run that nodes task run, and then return its output data and
      // associate it with This nodes input key
      await Promise.all(
        this.getInputs("output").map(async (key) => {
          inputs[key] = await Promise.all(
            this.inputs[key].map(async (con) => {
              await con.task.run(data, {
                needReset: false,
                garbage,
                propagate: false,
              });
              return con.task.outputData[con.key];
            })
          );
        })
      );

      const socketInfo = {
        target: fromSocket ? this.getInputFromConnection(fromSocket) : null,
      };

      console.log("INPUTS", inputs);
      this.outputData = await this.worker(this, inputs, data, socketInfo);

      if (this.component.task.onRun)
        this.component.task.onRun(this.node, this, data, socketInfo);

      if (propagate)
        await Promise.all(
          this.next
            .filter((con) => !this.closed.includes(con.key))
            // pass the socket that is being calledikno
            .map(async (con) => {
              return await con.task.run(data, {
                needReset: false,
                garbage,
                fromSocket: con.key,
              });
            })
        );
    }

    if (needReset) garbage.map((t) => t.reset());
  }

  clone(root = true, oldTask, newTask) {
    const inputs = Object.assign({}, this.inputs);

    if (root)
      // prevent of adding this task to `next` property of predecessor
      this.getInputs("option").map((key) => delete inputs[key]);
    // replace old tasks with new copies
    else
      Object.keys(inputs).forEach((key) => {
        inputs[key] = inputs[key].map((con) => ({
          ...con,
          task: con.task === oldTask ? newTask : con.task,
        }));
      });

    const task = new Task(inputs, this.component, this.node, this.worker);

    // manually add a copies of follow tasks
    task.next = this.next.map((n) => ({
      key: n.key,
      task: n.task.clone(false, this, task),
    }));

    return task;
  }
}
