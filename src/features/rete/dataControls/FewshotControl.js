import { DataControl } from "../plugins/inspectorPlugin";

export class FewshotControl extends DataControl {
  constructor() {
    const options = {
      data: "fewshot",
      name: "Fewshot",
      controls: {
        component: "longText",
      },
    };

    super(options);
  }

  onData(data) {
    return;
  }
}
