import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { triggerSocket, arraySocket } from "../sockets";
import { NumberSocketsControl } from "../dataControls/NumberSockets";

const info = `Response to Text converts a raw model response into a single text completion (taking the first choice)`;

export class ArrayToItems extends ThothReteComponent {
  constructor() {
    // Name of the component
    super("Array to Items");

    this.task = {
      outputs: {
        text: "output",
        trigger: "option",
      },
      init: (task) => {},
    };

    this.category = "Logic";
    this.display = true;
    this.info = info;
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node) {
    // Set fewshot into nodes data
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const modelInput = new Rete.Input("array", "Array", arraySocket);
    const dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);

    node
      .addInput(modelInput)
      .addInput(dataInput)
      .addOutput(dataOutput);

    // const outputGenerator = new SocketGeneratorControl({
    //   socketType: "stringSocket",
    //   connectionType: "output",
    //   name: "Output Sockets",
    //   ignored: ["trigger"],
    // });

    const numberSockets = new NumberSocketsControl({
      socketType: "anySocket",
      connectionType: "output",
      name: "Number of Output Sockets",
      ignored: ["trigger"],
    });
  
    node.inspector
      //.add(outputGenerator)
      .add(numberSockets)

    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs) {
    //console.log('arrayToItems inputs', inputs)
    const inputs_array = inputs.array[0]
    //console.log('inputs array', inputs_array)
    const outputs = inputs_array.reduce((acc, item, i) => {
      acc[i] = item
      return acc
    }, {});
    //console.log('outputs', outputs)

  return outputs
  }
}

