import Rete from "rete";
import { dataSocket, stringSocket } from "../sockets";
import { DisplayControl } from "../controls/DisplayControl";

export class ConsoleInput extends Rete.Component {
  constructor() {
    // Name of the component
    super("Console Input");

    this.task = {
      outputs: {
        text: "output",
        data: "option",
      },
      init: (task) => {
        const { subscribe, events } = this.editor.pubSub;

        subscribe(events.INPUT_CONSOLE, (_, text) => {
          task.run(text);
        });
      },
    };
  }

  displayControl = {};

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have garbbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is th ename, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataOutput = new Rete.Output("data", "Data", dataSocket);
    const textOutput = new Rete.Output("text", "Text", stringSocket);

    const display = new DisplayControl({
      key: "display",
      defaultDisplay: "Awaiting input...",
    });

    this.displayControl = display;

    return node.addOutput(textOutput).addOutput(dataOutput).addControl(display);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connecte components
  worker(node, inputs, text) {
    this.displayControl.display(text);

    return {
      text,
    };
  }
}
