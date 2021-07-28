import { addIO, removeIO } from "./utils";
import { ModuleManager } from "./module-manager";

function install(context, { engine, modules }) {
  const moduleManager = new ModuleManager(modules);

  context.moduleManager = moduleManager;

  moduleManager.setEngine(engine);

  context.on("componentregister", (component) => {
    if (!component.module) return;

    // socket - Rete.Socket instance or function that returns a socket instance
    const { nodeType, socket } = component.module;
    const name = component.name;

    switch (nodeType) {
      case "input":
        let inputsWorker = component.worker;

        moduleManager.registerInput(name, socket);

        component.worker = (...args) => {
          moduleManager.workerInputs.apply(moduleManager, args);
          if (inputsWorker) inputsWorker.apply(component, args);
        };
        break;
      case "triggerOut":
        let triggersWorker = component.worker;

        moduleManager.registerTriggerOut(name, socket);

        component.worker = (...args) => {
          moduleManager.workerTriggers.apply(moduleManager, args);
          if (triggersWorker) triggersWorker.apply(component, args);
        };
        break;
      case "triggerIn":
        let triggerInWorker = component.worker;

        moduleManager.registerTriggerIn(name, socket);

        component.worker = (...args) => {
          moduleManager.workerTriggers.apply(moduleManager, args);
          if (triggerInWorker) triggersWorker.apply(component, args);
        };
        break;
      case "module":
        const builder = component.builder;

        if (builder) {
          component.updateModuleSockets = (node) => {
            const modules = moduleManager.modules;
            removeIO(node, context);

            if (!node.data.module || !modules[node.data.module]) return;

            const data = modules[node.data.module].data;
            const inputs = moduleManager.getInputs(data);
            const outputs = moduleManager.getOutputs(data);
            const triggerOuts = moduleManager.getTriggerOuts(data);
            const triggerIns = moduleManager.getTriggerIns(data);

            try {
              // The arguments for this are getting bit crazy
              addIO(node, inputs, outputs, triggerOuts, triggerIns);
            } catch (e) {
              return context.trigger("warn", e);
            }
          };

          component.builder = async (node) => {
            component.updateModuleSockets(node);
            await builder.call(component, node);
          };
        }

        const moduleWorker = component.worker;

        component.worker = async (...args) => {
          console.log("working!");
          await moduleManager.workerModule.apply(moduleManager, args);
          if (moduleWorker) moduleWorker.apply(component, args);
        };
        break;
      case "output":
        let outputsWorker = component.worker;

        moduleManager.registerOutput(name, socket);

        component.worker = (...args) => {
          if (outputsWorker) outputsWorker.apply(component, args);
          moduleManager.workerOutputs.apply(moduleManager, args);
        };
        break;
      default:
        break;
    }
  });
}

const moduleExport = {
  install,
};

export default moduleExport;
