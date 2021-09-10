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
import { ThothReteComponent } from "./ThothReteComponent";
import { triggerSocket, anySocket } from "../sockets";
var info = "The Playtest Print component will print whatever value is attached to its input and print that valyue back to the playtest window.";
var PlaytestPrint = /** @class */ (function (_super) {
    __extends(PlaytestPrint, _super);
    function PlaytestPrint() {
        var _this = 
        // Name of the component
        _super.call(this, "Playtest Print") || this;
        _this.task = {
            outputs: {
                trigger: "option",
            },
            init: function (task) { },
        };
        _this.category = "I/O";
        _this.display = true;
        _this.info = info;
        return _this;
    }
    // the builder is used to "assemble" the node component.
    // when we have enki hooked up and have grabbed all few shots, we would use the builder
    // to generate the appropriate inputs and ouputs for the fewshot at build time
    PlaytestPrint.prototype.builder = function (node) {
        // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
        var triggerInput = new Rete.Input("trigger", "Trigger", triggerSocket);
        var triggerOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
        var textInput = new Rete.Input("text", "Print", anySocket);
        return node
            .addInput(textInput)
            .addInput(triggerInput)
            .addOutput(triggerOutput);
    };
    // the worker contains the main business logic of the node.  It will pass those results
    // to the outputs to be consumed by any connected components
    PlaytestPrint.prototype.worker = function (node, inputs, outputs, _a) {
        var silent = _a.silent;
        var sendToPlaytest = this.editor.thothV2.sendToPlaytest;
        if (!inputs || !inputs.text)
            return null;
        var text = inputs.text[0];
        sendToPlaytest(text);
        if (!silent)
            node.display(text);
    };
    return PlaytestPrint;
}(ThothReteComponent));
export { PlaytestPrint };
