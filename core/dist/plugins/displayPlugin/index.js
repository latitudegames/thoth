var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { DisplayControl } from "./DisplayControl";
function install(editor) {
    editor.on("componentregister", function (component) {
        var worker = component.worker;
        var builder = component.builder;
        var displayMap = {};
        component.builder = function (node) {
            var display = new DisplayControl({
                key: "display",
                defaultDisplay: "",
            });
            if (component.display) {
                node.addControl(display);
                displayMap[node.id] = display;
            }
            builder.call(component, node);
        };
        component.worker = function (node, inputs, outputs, data) {
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            if (displayMap[node.id])
                node.display = displayMap[node.id].display.bind(displayMap[node.id]);
            // handle modules, which are in the engine run
            if (data === null || data === void 0 ? void 0 : data.silent)
                node.display = function () { };
            worker.apply(component, __spreadArray([node, inputs, outputs, data], args, true));
        };
    });
}
var defaultExport = {
    name: "displayPlugin",
    install: install,
};
export default defaultExport;
