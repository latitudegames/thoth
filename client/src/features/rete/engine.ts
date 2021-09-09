
import Rete from "rete";
import ModulePlugin from "./plugins/modulePlugin";
import TaskPlugin from "./plugins/taskPlugin";

export const initSharedEngine = (name: string, modules: any[], components: any[], server: boolean = false) => {
    const engine = new Rete.Engine(name);
  
    engine.use(ModulePlugin, { engine, modules } as any);
  
    if (server) {
      engine.use(TaskPlugin);
    }
  
    engine.bind("run");
  
    components.forEach((c) => {
      engine.register(c);
    });
  
    return engine;
  }