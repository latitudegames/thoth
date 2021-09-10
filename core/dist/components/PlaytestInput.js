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
import { triggerSocket, stringSocket } from "../sockets";
var info = "The Playtest Input component is connected to the playtest window. It received anything which is type dinto the playtest areavia the input and will trigger the running of your spell chain.";
var PlaytestInput = /** @class */ (function (_super) {
    __extends(PlaytestInput, _super);
    function PlaytestInput() {
        var _this = 
        // Name of the component
        _super.call(this, "Playtest Input") || this;
        _this.subscriptionMap = {};
        _this.task = {
            outputs: {
                text: "output",
                trigger: "option",
            },
            init: function (task) {
                _this.initialTask = task;
            },
        };
        _this.category = "I/O";
        _this.display = true;
        _this.info = info;
        return _this;
    }
    PlaytestInput.prototype.subscribeToPlaytest = function (node) {
        var _this = this;
        var onPlaytest = this.editor.thothV2.onPlaytest;
        // store the unsubscribe function in our node map
        this.subscriptionMap[node.id] = onPlaytest(function (text) {
            var _a, _b;
            // attach the text to the nodes data for access in worker
            node.data.text = text;
            // will need to run this here with the stater rather than the text
            (_a = _this.initialTask) === null || _a === void 0 ? void 0 : _a.run(text);
            (_b = _this.initialTask) === null || _b === void 0 ? void 0 : _b.reset();
            _this.editor.trigger("process");
        });
    };
    PlaytestInput.prototype.destroyed = function (node) {
        if (this.subscriptionMap[node.id])
            this.subscriptionMap[node.id]();
        delete this.subscriptionMap[node.id];
    };
    // the builder is used to "assemble" the node component.
    // when we have enki hooked up and have garbbed all few shots, we would use the builder
    // to generate the appropriate inputs and ouputs for the fewshot at build time
    PlaytestInput.prototype.builder = function (node) {
        if (this.subscriptionMap[node.id])
            this.subscriptionMap[node.id]();
        delete this.subscriptionMap[node.id];
        // create inputs here. First argument is th ename, second is the type (matched to other components sockets), and third is the socket the i/o will use
        var dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
        var textOutput = new Rete.Output("text", "Text", stringSocket);
        this.subscribeToPlaytest(node);
        return node.addOutput(textOutput).addOutput(dataOutput);
    };
    // the worker contains the main business logic of the node.  It will pass those results
    // to the outputs to be consumed by any connecte components
    PlaytestInput.prototype.worker = function (node, inputs, outputs, _a) {
        var data = _a.data, silent = _a.silent;
        if (!silent)
            node.display(data);
        return {
            text: data,
        };
    };
    return PlaytestInput;
}(ThothReteComponent));
export { PlaytestInput };
