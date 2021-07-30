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
          if (inputsWorker) return inputsWorker.apply(component, args);
        };
        break;
      case "triggerOut":
        let triggersWorker = component.worker;

        moduleManager.registerTriggerOut(name, socket);

        component.worker = (node, inputs, outputs, context) => {
          let _outputs = outputs;
          if (triggersWorker) {
            _outputs = triggersWorker.apply(component, [
              node,
              inputs,
              outputs,
              context,
            ]);
          }
          return moduleManager.workerTriggerOuts.apply(moduleManager, [
            node,
            inputs,
            _outputs,
            context,
          ]);
        };
        break;
      case "triggerIn":
        let triggerInWorker = component.worker;

        moduleManager.registerTriggerIn(name, socket);

        component.worker = (...args) => {
          moduleManager.workerTriggerIns.apply(moduleManager, args);
          if (triggerInWorker) triggerInWorker.apply(component, args);
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
            if (!component.noBuildUpdate) component.updateModuleSockets(node);
            await builder.call(component, node);
          };
        }

        const moduleWorker = component.worker;

        component.worker = async (node, inputs, outputs, context) => {
          const module = await moduleManager.workerModule.apply(moduleManager, [
            node,
            inputs,
            outputs,
            context,
          ]);

          if (moduleWorker)
            return moduleWorker.call(component, node, inputs, outputs, {
              ...context,
              module,
            });
        };
        break;
      case "output":
        let outputsWorker = component.worker;

        moduleManager.registerOutput(name, socket);

        component.worker = (...args) => {
          if (outputsWorker) outputsWorker.apply(component, args);
          return moduleManager.workerOutputs.apply(moduleManager, args);
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
