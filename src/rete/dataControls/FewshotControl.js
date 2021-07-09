import { DataControl } from "../plugins/inspectorPlugin";

export class FewshotControl extends DataControl {
  constructor() {
    const options = {
      data: "fewshot",
      name: "Fewshot",
      controls: {
        type: "longText",
      },
    };

    super(options);
  }

  onData(data) {
    console.log("ON DATA", data);
  }
}
