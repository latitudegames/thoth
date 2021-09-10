import Rete from "rete";
import ModulePlugin from "./plugins/modulePlugin";
import TaskPlugin from "./plugins/taskPlugin";
export var initSharedEngine = function (name, modules, components, server) {
    if (server === void 0) { server = false; }
    var engine = new Rete.Engine(name);
    engine.use(ModulePlugin, { engine: engine, modules: modules });
    if (server) {
        engine.use(TaskPlugin);
    }
    engine.bind("run");
    components.forEach(function (c) {
        engine.register(c);
    });
    return engine;
};
