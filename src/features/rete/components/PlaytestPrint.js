import Rete from "rete";
import { triggerSocket, anySocket } from "../sockets";

const info = `The Playtest Print component will print whatever value is attached to its input and print that valyue back to the playtest window.`;
export class PlaytestPrint extends Rete.Component {
  constructor() {
    // Name of the component
    super("Playtest Print");

    this.task = {
      outputs: {
        trigger: "option",
      },
    };

    this.category = "I/O";
    this.display = true;
    this.info = info;
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const triggerInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const triggerOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
    const textInput = new Rete.Input("text", "Print", anySocket);

    return node
      .addInput(textInput)
      .addInput(triggerInput)
      .addOutput(triggerOutput);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(node, inputs, outputs, { silent }) {
    const { sendToPlaytest } = this.editor.thothV2;
    if (!inputs || !inputs.text) return null;
    const text = inputs.text[0];

    sendToPlaytest(text);
    if (!!silent) node.display(text);
  }
}
