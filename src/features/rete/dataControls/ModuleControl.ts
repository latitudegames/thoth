import { DataControl } from "../plugins/inspectorPlugin";

export class ModuleControl extends DataControl {
  constructor({ name, icon = "sieve", write = false }) {
    const options = {
      dataKey: "module",
      name: name,
      component: "moduleSelect",
      write,
      icon,
    };

    super(options);
  }
}
