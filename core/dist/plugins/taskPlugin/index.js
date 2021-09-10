var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { Task } from "./task";
function install(editor) {
    editor.on("componentregister", function (component) {
        if (!component.task)
            throw new Error("Task plugin requires a task property in component");
        if (component.task.outputs.constructor !== Object)
            throw new Error('The "outputs" field must be an object whose keys correspond to the Output\'s keys');
        var taskWorker = component.worker;
        var taskOptions = component.task;
        component.worker = function (node, inputs, outputs, args) {
            var rest = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                rest[_i - 4] = arguments[_i];
            }
            var task = new Task(inputs, component, node, function (ctx, inputs, data, socketInfo) {
                component._task = task;
                // might change this interface, since we swap out data for outputs here, which just feels wrong.
                return taskWorker.call.apply(taskWorker, __spreadArray([component,
                    node,
                    inputs,
                    outputs, __assign(__assign({}, args), { data: data, socketInfo: socketInfo })], rest, false));
            });
            if (taskOptions.init)
                taskOptions.init(task, node);
            Object.keys(taskOptions.outputs).forEach(function (key) {
                outputs[key] = { type: taskOptions.outputs[key], key: key, task: task };
            });
        };
    });
}
export { Task } from "./task";
var defaultExport = {
    name: "task",
    install: install,
};
export default defaultExport;
