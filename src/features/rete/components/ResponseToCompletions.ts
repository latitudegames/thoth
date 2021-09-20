import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { arraySocket, triggerSocket, objectSocket } from "../sockets";

const info = `Response to Text converts a raw model response into an array of text continuations`;

export class ResponseToCompletions extends ThothReteComponent {
  constructor() {
    // Name of the component
    super("Response to Completions");

    this.task = {
      outputs: {
        completions: "output",
        trigger: "option",
      },
      init: (task) => {},
    };

    this.category = "AI/ML";
    this.display = true;
    this.info = info;
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const modelInput = new Rete.Input("response", "Response", objectSocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
    const out = new Rete.Output("completions", "Completions", arraySocket);

    return node
      .addInput(modelInput)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, outputs) {
    const choices = inputs['response']['0'].choices;
    // completions is an array of the text of each choice in choices
    const completions = choices.map((choice) => choice.text);
    console.log(completions)
    return {
      completions
    };
  }
}