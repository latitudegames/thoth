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
import { triggerSocket } from "../sockets";
import { v4 as uuidv4 } from "uuid";
var info = "The module trigger out component adds a trigger out socket to the parent module.  It can be given a name, which is displayed on the parent.";
var ModuleTriggerOut = /** @class */ (function (_super) {
    __extends(ModuleTriggerOut, _super);
    function ModuleTriggerOut() {
        var _this = 
        // Name of the component
        _super.call(this, "Module Trigger Out") || this;
        _this.contextMenuName = "Trigger Out";
        _this.task = {
            outputs: {
                trigger: "output",
            },
        };
        _this.module = {
            nodeType: "triggerOut",
            socket: triggerSocket,
        };
        _this.category = "Module";
        _this.info = info;
        _this.workspaceType = "module";
        return _this;
    }
    // the builder is used to "assemble" the node component.
    // when we have enki hooked up and have grabbed all few shots, we would use the builder
    // to generate the appropriate inputs and ouputs for the fewshot at build time
    ModuleTriggerOut.prototype.builder = function (node) {
        var _a;
        // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
        var input = new Rete.Input("trigger", "Trigger", triggerSocket);
        // Handle default value if data is present
        var nameInput = new InputControl({
            dataKey: "name",
            name: "Trigger name",
        });
        node.inspector.add(nameInput);
        node.data.socketKey = ((_a = node === null || node === void 0 ? void 0 : node.data) === null || _a === void 0 ? void 0 : _a.socketKey) || uuidv4();
        return node.addInput(input);
    };
    ModuleTriggerOut.prototype.worker = function (node, inputs, outputs) {
        return {
            trigger: true,
        };
    };
    return ModuleTriggerOut;
}(Rete.Component));
export { ModuleTriggerOut };
