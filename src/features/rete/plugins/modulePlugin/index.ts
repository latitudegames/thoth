import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Engine, NodeEditor, Component, Socket } from "rete/types";
import { addIO, removeIO } from "./utils";
import { ModuleManager } from "./module-manager";
import { Module } from "./module";

//need to fix this interface.  For some reason doing the joing
interface IRunContextEngine extends Engine {
  moduleManager: ModuleManager;
  on: any;
  trigger: any;
}

interface IRunContextEditor extends NodeEditor {
  moduleManager: ModuleManager;
}

type ModuleOptions = {
  socket: Socket;
  nodeType: "input" | "output" | "triggerIn" | "triggerOut" | "module";
};

interface IModuleComponent extends Component {
  updateModuleSockets: Function;
  module: ModuleOptions;
  noBuildUpdate: boolean;
}

function install(
  runContext: IRunContextEngine | IRunContextEditor,
  { engine, modules }
) {
  const moduleManager = new ModuleManager(modules);

  runContext.moduleManager = moduleManager;

  moduleManager.setEngine(engine);

  runContext.on("componentregister", (component: IModuleComponent) => {
    if (!component.module) return;

    // socket - Rete.Socket instance or function that returns a socket instance
    const { nodeType, socket } = component.module;
    const name = component.name;

    switch (nodeType) {
      case "input":
        let inputsWorker = component.worker;

        moduleManager.registerInput(name, socket);

        component.worker = (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: WorkerOutputs,
          context
        ) => {
          moduleManager.workerInputs.call(
            moduleManager,
            node,
            inputs,
            outputs,
            context as { module: Module }
          );
          if (inputsWorker)
            return inputsWorker.call(component, node, inputs, outputs, context);
        };
        break;
      case "triggerOut":
        let triggersWorker = component.worker as any;

        moduleManager.registerTriggerOut(name, socket);

        component.worker = (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: WorkerOutputs,
          context
        ) => {
          let _outputs = outputs;
          if (triggersWorker) {
            _outputs = triggersWorker.call(
              component,
              node,
              inputs,
              outputs,
              context
            );
          }
          return moduleManager.workerTriggerOuts.call(
            moduleManager,
            node,
            inputs,
            _outputs,
            context as { module: Module }
          );
        };
        break;
      case "triggerIn":
        let triggerInWorker = component.worker;

        moduleManager.registerTriggerIn(name, socket);

        component.worker = (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: WorkerOutputs,
          context
        ) => {
          moduleManager.workerTriggerIns.call(
            moduleManager,
            node,
            inputs,
            outputs,
            context as any
          );
          if (triggerInWorker)
            triggerInWorker.call(component, node, inputs, outputs, context);
        };
        break;
      case "module":
        const builder = component.builder;

        if (builder) {
          component.updateModuleSockets = (node) => {
            const modules = moduleManager.modules;
            removeIO(node, runContext);

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
              return runContext.trigger("warn", e);
            }
          };

          component.builder = async (node) => {
            if (!component.noBuildUpdate) component.updateModuleSockets(node);
            await builder.call(component, node);
          };
        }

        const moduleWorker = component.worker;

        component.worker = async (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: WorkerOutputs,
          context: object
        ) => {
          const module = await moduleManager.workerModule.call(
            moduleManager,
            node,
            inputs,
            outputs,
            context
          );

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

        component.worker = (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: WorkerOutputs,
          context
        ) => {
          if (outputsWorker)
            outputsWorker.call(component, node, inputs, outputs, context);
          return moduleManager.workerOutputs.call(
            moduleManager,
            node,
            inputs,
            outputs,
            context as { module: Module }
          );
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
