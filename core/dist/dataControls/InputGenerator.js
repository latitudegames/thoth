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
import Rete from "rete";
import * as sockets from "../sockets";
import { DataControl } from "../plugins/inspectorPlugin";
var InputGeneratorControl = /** @class */ (function (_super) {
    __extends(InputGeneratorControl, _super);
    function InputGeneratorControl(_a) {
        var _b = _a.defaultOutputs, defaultOutputs = _b === void 0 ? [] : _b, _c = _a.socketType, socketType = _c === void 0 ? "anySocket" : _c, _d = _a.taskType, taskType = _d === void 0 ? "output" : _d, _e = _a.ignored, ignored = _e === void 0 ? [] : _e, _f = _a.icon, icon = _f === void 0 ? "properties" : _f;
        var _this = this;
        var options = {
            dataKey: "inputs",
            name: "Data Inputs",
            component: "inputGenerator",
            icon: icon,
            data: {
                ignored: ignored,
                socketType: socketType,
                taskType: taskType,
            },
        };
        _this = _super.call(this, options) || this;
        return _this;
    }
    InputGeneratorControl.prototype.onData = function (inputs) {
        var _this = this;
        var _a, _b;
        if (!inputs)
            return;
        this.node.data.inputs = inputs;
        var existingInputs = [];
        var ignored = ((_b = (_a = this === null || this === void 0 ? void 0 : this.control) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.ignored.map(function (input) { return input.name; })) || [];
        this.node.inputs.forEach(function (out) {
            existingInputs.push(out.key);
        });
        // Any inputs existing on the current node that arent incoming have been deleted
        // and need to be removed.
        existingInputs
            .filter(function (existing) { return !inputs.some(function (incoming) { return incoming.name === existing; }); })
            .filter(function (existing) { return ignored.some(function (input) { return input !== existing; }); })
            .forEach(function (key) {
            var output = _this.node.inputs.get(key);
            _this.node
                .getConnections()
                .filter(function (con) { return con.input.key === key; })
                .forEach(function (con) {
                _this.editor.removeConnection(con);
            });
            _this.node.removeInput(output);
        });
        // any incoming inputs not already on the node are new and will be added.
        var newInputs = inputs.filter(function (input) { return !existingInputs.includes(input.name); });
        // From these new inputs, we iterate and add an output socket to the node
        newInputs.forEach(function (output) {
            var newInput = new Rete.Input(output.name.toLowerCase(), output.name, sockets[output.socketType]);
            _this.node.addInput(newInput);
        });
        this.node.update();
    };
    return InputGeneratorControl;
}(DataControl));
export { InputGeneratorControl };
