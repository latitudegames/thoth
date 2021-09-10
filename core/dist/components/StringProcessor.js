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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Rete from "rete";
import { ThothReteComponent } from "./ThothReteComponent";
import { stringSocket, triggerSocket } from "../sockets";
import { OutputGeneratorControl } from "../dataControls/OutputGenerator";
import { CodeControl } from "../dataControls/CodeControl";
var info = "The String Processor component take s astring as an input and allows you to write a function in the text editor to parse that string in whatever way you need.  You can define any number of outputs which you can pass the result of your parsing out through.\n\nNote that the return value of your function must be an objetc whose keys match the names of your generated output sockets.";
var StringProcessor = /** @class */ (function (_super) {
    __extends(StringProcessor, _super);
    function StringProcessor() {
        var _this = 
        // Name of the component
        _super.call(this, "String Processor") || this;
        _this.node = {};
        _this.task = {
            outputs: { trigger: "option" },
            init: function (task) { },
        };
        _this.category = "Logic";
        _this.info = info;
        return _this;
    }
    StringProcessor.prototype.builder = function (node) {
        // Add a default javascript template if the node is new and we don't have one.
        if (!node.data.code)
            node.data.code =
                '(inputStr) => {\n    return { "outputKey": "outputValue" }\n}';
        // Rete controls
        var input = new Rete.Input("input", "Input", stringSocket);
        var triggerIn = new Rete.Input("trigger", "Trigger", triggerSocket);
        var triggerOut = new Rete.Output("trigger", "Trigger", triggerSocket);
        // Inspector controls
        var outputGenerator = new OutputGeneratorControl({
            socketType: "stringSocket",
            taskType: "output",
            ignored: [
                {
                    name: "trigger",
                    socketType: "triggerSocket",
                    taskType: "option",
                },
            ],
        });
        var codeControl = new CodeControl({
            dataKey: "code",
            name: "code",
        });
        node.inspector.add(outputGenerator);
        node.inspector.add(codeControl);
        return node.addInput(input).addInput(triggerIn).addOutput(triggerOut);
    };
    StringProcessor.prototype.worker = function (node, inputs, data) {
        return __awaiter(this, void 0, void 0, function () {
            var input, stringProcessor, outputs, lowerCasedOutputs;
            return __generator(this, function (_a) {
                input = inputs["input"][0];
                stringProcessor = eval(node.data.code);
                outputs = stringProcessor(input);
                lowerCasedOutputs = Object.keys(outputs).reduce(function (prev, key) {
                    var _a;
                    return __assign(__assign({}, prev), (_a = {}, _a[key.toLowerCase()] = outputs[key], _a));
                }, {});
                return [2 /*return*/, lowerCasedOutputs];
            });
        });
    };
    return StringProcessor;
}(ThothReteComponent));
export { StringProcessor };
