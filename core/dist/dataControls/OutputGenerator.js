var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import * as sockets from "../sockets";
import { DataControl } from "../plugins/inspectorPlugin";
var OutputGeneratorControl = /** @class */ (function (_super) {
    __extends(OutputGeneratorControl, _super);
    function OutputGeneratorControl(_a) {
        var _b = _a.socketType, socketType = _b === void 0 ? "anySocket" : _b, _c = _a.taskType, taskType = _c === void 0 ? "output" : _c, _d = _a.ignored, ignored = _d === void 0 ? [] : _d, _e = _a.icon, icon = _e === void 0 ? "properties" : _e;
        var _this = this;
        var options = {
            dataKey: "outputs",
            name: "Data Outputs",
            component: "outputGenerator",
            icon: icon,
            data: {
                ignored: ignored,
                socketType: socketType,
                taskType: taskType,
            },
        };
        _this = _super.call(this, options) || this;
        _this.socketType = socketType;
        return _this;
    }
    OutputGeneratorControl.prototype.onData = function (outputs) {
        var _this = this;
        var _a, _b;
        if (outputs === void 0) { outputs = []; }
        this.node.data.outputs = outputs;
        var existingOutputs = [];
        var ignored = ((_b = (_a = this === null || this === void 0 ? void 0 : this.control) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.ignored.map(function (output) { return output.name; })) || [];
        this.node.outputs.forEach(function (out) {
            existingOutputs.push(out.key);
        });
        // Any outputs existing on the current node that arent incoming have been deleted
        // and need to be removed.
        existingOutputs
            .filter(function (existing) { return !outputs.some(function (incoming) { return incoming.name === existing; }); })
            .filter(function (existing) { return ignored.some(function (out) { return out !== existing; }); })
            .forEach(function (key) {
            var output = _this.node.outputs.get(key);
            _this.node
                .getConnections()
                .filter(function (con) { return con.output.key === key; })
                .forEach(function (con) {
                _this.editor.removeConnection(con);
            });
            _this.node.removeOutput(output);
            delete _this.component.task.outputs[key.toLowerCase()];
        });
        // any incoming outputs not already on the node are new and will be added.
        var newOutputs = outputs.filter(function (out) { return !existingOutputs.includes(out.name); });
        // Here we are running over and ensuring that the outputs are in the task
        this.component.task.outputs = this.node.data.outputs.reduce(function (acc, out) {
            acc[out.name.toLowerCase()] = out.taskType || "output";
            return acc;
        }, __assign({}, this.component.task.outputs));
        // From these new outputs, we iterate and add an output socket to the node
        newOutputs.forEach(function (output) {
            var newOutput = new Rete.Output(output.name.toLowerCase(), output.name, sockets[output.socketType]);
            _this.node.addOutput(newOutput);
        });
        this.node.update();
    };
    return OutputGeneratorControl;
}(DataControl));
export { OutputGeneratorControl };
