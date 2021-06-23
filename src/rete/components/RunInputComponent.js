import Rete from "rete";
import { TextInputControl } from "../controls/TextInputControl";
import { stringSocket, dataSocket } from "../sockets";
import { RunButtonControl } from "../controls/RunButtonControl";

export class RunInputComponent extends Rete.Component {
  constructor() {
    // Name of the component
    super("Input with run");

    this.task = {
      outputs: {
        text: "output",
        data: "option",
      },
      init: (task) => {
        console.log("INIT");
        this.initialTask = task;
        console.log("this", this);
      },
    };
  }

  run() {
    const initialData = {
      foo: "foo",
    };
    this.initialTask.run(initialData);
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have garbbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is th ename, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output("text", "String", stringSocket);
    const data = new Rete.Output("data", "Data", dataSocket);

    // controls are the internals of the node itself
    // This default control simple has a tet field.
    const input = new TextInputControl({
      emitter: this.editor,
      key: "text",
      value: "Input text",
    });

    const run = new RunButtonControl({
      emitter: this.editor,
      key: "run",
      run: this.run.bind(this),
    });

    return node
      .addOutput(data)
      .addOutput(out)
      .addControl(input)
      .addControl(run);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  async worker(node, inputs, data) {
    console.log("node", node);
    console.log("data", data);
    return {
      text: node.data.text,
    };
  }
}
