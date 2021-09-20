import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { stringSocket, triggerSocket, objectSocket } from "../sockets";

const info = `Response to Text converts a raw model response into a single text completion (taking the first choice)`;

export class ResponseToText extends ThothReteComponent {
  constructor() {
    // Name of the component
    super("Response to Text");

    this.task = {
      outputs: {
        text: "output",
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
    const out = new Rete.Output("text", "Text", stringSocket);

    return node
      .addInput(modelInput)
      .addInput(dataInput)
      .addOutput(out)
      .addOutput(dataOutput);
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, outputs) {
    const text = inputs['response']['0'].choices[0].text;
    return {
      text: text,
    };
  }
}

