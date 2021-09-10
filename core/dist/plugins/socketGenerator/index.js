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
import Rete from "rete";
import * as sockets from "../../sockets";
function install(editor) {
    editor.on("componentregister", function (component) {
        var builder = component.builder;
        // we are going to override the default builder with our own, and will invoke the original builder inside it.
        component.builder = function (node) {
            // Handle outputs in the nodes data to repopulate when loading from JSON
            if (node.data.outputs && node.data.outputs.length !== 0) {
                var outputMap_1 = {};
                node.outputs.forEach(function (value, key) {
                    outputMap_1[key] = value;
                });
                node.data.outputs.forEach(function (key) {
                    if (outputMap_1[key])
                        return;
                    var output = new Rete.Output(key.socketKey ? key.socketKey : key.name, key.name, sockets[key.socketType]);
                    node.addOutput(output);
                });
            }
            if (node.data.outputs && node.data.outputs.length > 0) {
                component.task.outputs = node.data.outputs.reduce(function (acc, out) {
                    acc[out.socketKey] = out.taskType || "output";
                    return acc;
                }, __assign({}, component.task.outputs));
            }
            if (node.data.inputs && node.data.inputs.length !== 0) {
                // get inputs from node.inputs
                var inputMap_1 = {};
                node.inputs.forEach(function (value, key) {
                    inputMap_1[key] = value;
                });
                node.data.inputs.forEach(function (key) {
                    // If the input key is already on the node, return
                    if (inputMap_1[key])
                        return;
                    var input = new Rete.Input(key.socketKey ? key.socketKey : key.name, key.name, sockets[key.socketType]);
                    node.addInput(input);
                });
            }
            builder.call(component, node);
        };
    });
}
var defaultExport = {
    name: "socketGenerator",
    install: install,
};
export default defaultExport;
