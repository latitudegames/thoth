import Rete from "rete";
import { dataSocket, stringSocket } from "../sockets";
import { DisplayControl } from "../controls/DisplayControl";

export class PlaytestInput extends Rete.Component {
  constructor() {
    // Name of the component
    super("Playtest Input");

    this.task = {
      outputs: {
        text: "output",
        data: "option",
      },
      init: (task) => {
        this.initialTask = task;
      },
    };

    this.category = "I/O"
  }

  displayControl = {};
  unsubscribe = null;

  subscribeToPlaytest(node) {
    const { subscribe, events } = this.editor.pubSub;

    this.unsubscribe = subscribe(events.PLAYTEST_INPUT, (_, text) => {
      // attach the text to the nodes data for access in worker
      node.data.text = text;

      // will need to run this here with the stater rather than the text
      this.initialTask.run(text);
      this.initialTask.reset();
      this.editor.trigger("process");
    });
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have garbbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = null;

    // create inputs here. First argument is th ename, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataOutput = new Rete.Output("data", "Data", dataSocket);
    const textOutput = new Rete.Output("text", "Text", stringSocket);

    const display = new DisplayControl({
      key: "display",
      defaultDisplay: "Awaiting input...",
    });

    this.displayControl = display;

    this.subscribeToPlaytest(node);

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
