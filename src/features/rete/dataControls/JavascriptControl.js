import { DataControl } from "../plugins/inspectorPlugin";

export class JavascriptControl extends DataControl {
  constructor(data = {}) {
    const options = {
      dataKey: "javascript",
      name: "Javascript",
      controls: {
        component: "longText",
        data,
      },
    };

    super(options);
  }

  onData(data) {
    return;
  }
}
