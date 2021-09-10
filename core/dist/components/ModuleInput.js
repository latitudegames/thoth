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
import { InputControl } from "../dataControls/InputControl";
import { anySocket } from "../sockets";
import { v4 as uuidv4 } from "uuid";
var info = "The module input component adds an input socket to the parent module.  It can be given a name, which is displayed on the parent.";
var ModuleInput = /** @class */ (function (_super) {
    __extends(ModuleInput, _super);
    function ModuleInput() {
        var _this = 
        // Name of the component
        _super.call(this, "Module Input") || this;
        _this.contextMenuName = "Input";
        _this.task = {
            outputs: {
                output: "output",
            },
        };
        _this.module = {
            nodeType: "input",
            socket: anySocket,
        };
        _this.category = "Module";
        _this.info = info;
        _this.workspaceType = "module";
        return _this;
    }
    // the builder is used to "assemble" the node component.
    // when we have enki hooked up and have grabbed all few shots, we would use the builder
    // to generate the appropriate inputs and ouputs for the fewshot at build time
    ModuleInput.prototype.builder = function (node) {
        var _a;
        // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
        var out = new Rete.Output("output", "output", anySocket);
        // Handle default value if data is present
        var nameInput = new InputControl({
            dataKey: "name",
            name: "Input name",
        });
        node.inspector.add(nameInput);
        node.data.socketKey = ((_a = node === null || node === void 0 ? void 0 : node.data) === null || _a === void 0 ? void 0 : _a.socketKey) || uuidv4();
        return node.addOutput(out);
    };
    ModuleInput.prototype.worker = function (node, inputs, outputs) {
        console.log("input worker outputs", outputs);
        // outputs in this case is a key value oibject of outputs.
        // perfect for task return
        return outputs;
    };
    return ModuleInput;
}(Rete.Component));
export { ModuleInput };
