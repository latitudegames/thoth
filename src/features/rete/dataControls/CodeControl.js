import { DataControl } from "../plugins/inspectorPlugin";

const defaultCode = `
// function gives you the inputs, outputs, and the node
// inputs and outputs are an object map where the keys are your defined inputs and outputs.
function(inputs, outputs, node) {

  // The keys of the object returned must match the names of your outputs you defined.
  return {}
}
`;
export class CodeControl extends DataControl {
  constructor({ dataKey, name }) {
    const options = {
      dataKey: dataKey,
      name: name,
      controls: {
        component: "code",
        data: {
          language: "javascript",
          defaultCode,
        },
      },
    };

    super(options);
  }

  onData(data) {
    return;
  }
}
