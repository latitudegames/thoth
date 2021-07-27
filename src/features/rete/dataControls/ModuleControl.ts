import { DataControl } from "../plugins/inspectorPlugin";

export class ModuleControl extends DataControl {
  constructor({ name, icon = "sieve" }) {
    const options = {
      dataKey: "module",
      name: name,
      component: "moduleSelect",
      icon,
    };

    super(options);
  }
}
