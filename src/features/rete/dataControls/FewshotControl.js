import { DataControl } from "../plugins/inspectorPlugin";

export class FewshotControl extends DataControl {
  constructor(data = {}) {
    const options = {
      dataKey: "fewshot",
      name: "Fewshot",
      controls: {
        component: "longText",
        data,
      },
    };

    super(options);
  }

  onData(data) {
    console.log("Data", data);
    return;
  }
}
