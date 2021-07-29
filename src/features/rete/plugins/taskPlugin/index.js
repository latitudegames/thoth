import { Task } from "./task";

function install(editor) {
  editor.on("componentregister", (component) => {
    if (!component.task)
      throw new Error("Task plugin requires a task property in component");
    if (component.task.outputs.constructor !== Object)
      throw new Error(
        'The "outputs" field must be an object whose keys correspond to the Output\'s keys'
      );

    const taskWorker = component.worker;
    const taskOptions = component.task;

    component.worker = (node, inputs, outputs, args, ...rest) => {
      const task = new Task(
        inputs,
        component,
        node,
        (ctx, inps, data, socketInfo) => {
          component._task = task;
          // might change this interface, since we swap out data for outputs here, which just feels wrong.
          return taskWorker.call(
            component,
            node,
            inps,
            outputs,
            { ...args, data, socketInfo },
            ...rest
          );
        }
      );

      if (taskOptions.init) taskOptions.init(task, node);

      Object.keys(taskOptions.outputs).forEach((key) => {
        outputs[key] = { type: taskOptions.outputs[key], key, task };
      });
    };
  });
}

export { Task } from "./task";

const defaultExport = {
  name: "task",
  install,
};

export default defaultExport;
