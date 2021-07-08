import { DataControl } from "../plugins/inspectorPlugin";

export class FewshotControl extends DataControl {
  constructor({ onData }) {
    const options = {
      data: "fewshot",
      name: "Fewshot",
      controls: {
        type: "longText",
      },
      onData,
    };

    super(options);
  }
}
