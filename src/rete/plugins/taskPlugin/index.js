import { Task } from "./task";

function install(editor) {
  editor.on("componentregister", (component) => {
    console.log("REGISTERING TASK PLUGIN");
    if (!component.task)
      throw new Error("Task plugin requires a task property in component");
    if (component.task.outputs.constructor !== Object)
      throw new Error(
        'The "outputs" field must be an object whose keys correspond to the Output\'s keys'
      );

    const taskWorker = component.worker;
    const taskOptions = component.task;

    component.worker = (node, inputs, outputs) => {
      const task = new Task(inputs, component, (ctx, inps, data) => {
        component._task = task;
        return taskWorker.call(component, node, inps, data);
      });

      if (taskOptions.init) taskOptions.init(task, node);

      console.log("Task outputs", node, taskOptions.output);

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
