import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { TextInputControl } from "../controls/TextInputControl";
import { stringSocket, triggerSocket } from "../sockets";
import { RunButtonControl } from "../controls/RunButtonControl";
import { Task } from "../plugins/taskPlugin/task"

const info = `The Input With Run component lets you input a value into the provided input field, and trigger off your spell chain to run with that value passed out its output. May be depricated in favor of using the playtest input component.`;

export class RunInputComponent extends ThothReteComponent {
  initialTask?: Task
  constructor() {
    // Name of the component
    super("Input With Run");

    this.task = {
      outputs: {
        text: "output",
        trigger: "option",
      },
      init: (task) => {
        this.initialTask = task;
      },
    };
    this.category = "I/O";
    this.info = info;
  }

  run() {
    const initialData = {
      foo: "foo",
    };
    this.initialTask?.run(initialData);
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output("text", "String", stringSocket);
    const data = new Rete.Output("trigger", "Trigger", triggerSocket);

    // controls are the internals of the node itself
    // This default control sample has a text field.
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
      .addOutput(out)
      .addOutput(data)
      .addControl(input)
      .addControl(run);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, data) {
    return {
      text: node.data.text,
    };
  }
}
