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
import Handlebars from "handlebars";
import { triggerSocket, stringSocket } from "../sockets";
import { SocketGeneratorControl } from "../dataControls/SocketGenerator";
import { InputControl } from "../dataControls/InputControl";
import { FewshotControl } from "../dataControls/FewshotControl";
var info = "The generator component is our general purpose completion component.  You can define any number of inputs, and utilise those inputs in a templating language known as Handlebars.  Any value which is wrapped like {{this}} in double braces will be replaced with the corresponding value coming in to the input with the same name.  This allows you to write almost any fewshot you might need, and input values from anywhere else in your chain.\n\nControls have also been added which give you control of some of the fundamental settings of the OpenAI completion endpoint, including temperature, max tokens, and your stop sequence.\n\nThe componet has two returns.  The composed will output your entire fewshot plus the completion, whereas the result output will only be the result of the completion. ";
var Generator = /** @class */ (function (_super) {
    __extends(Generator, _super);
    function Generator() {
        var _this = _super.call(this, "Generator") || this;
        _this.task = {
            outputs: {
                result: "output",
                composed: "output",
                trigger: "option",
            },
            init: function (task) { },
        };
        _this.category = "AI/ML";
        _this.info = info;
        return _this;
    }
    Generator.prototype.builder = function (node) {
        var dataIn = new Rete.Input("trigger", "Trigger", triggerSocket);
        var dataOut = new Rete.Output("trigger", "Trigger", triggerSocket);
        var resultOut = new Rete.Output("result", "Result", stringSocket);
        var composedOut = new Rete.Output("composed", "Composed", stringSocket);
        node
            .addInput(dataIn)
            .addOutput(dataOut)
            .addOutput(resultOut)
            .addOutput(composedOut);
        var nameControl = new InputControl({
            dataKey: "name",
            name: "Component Name",
        });
        var inputGenerator = new SocketGeneratorControl({
            connectionType: "input",
            name: "Input Sockets",
            ignored: ["trigger"],
        });
        var fewshotControl = new FewshotControl({
            language: "handlebars",
        });
        var stopControl = new InputControl({
            dataKey: "stop",
            name: "Stop",
            icon: "stop-sign",
        });
        var temperatureControl = new InputControl({
            dataKey: "temp",
            name: "Temperature",
            icon: "temperature",
        });
        var maxTokenControl = new InputControl({
            dataKey: "maxTokens",
            name: "Max Tokens",
            icon: "moon",
        });
        node.inspector
            .add(nameControl)
            .add(inputGenerator)
            .add(fewshotControl)
            .add(stopControl)
            .add(temperatureControl)
            .add(maxTokenControl);
        return node;
    };
    Generator.prototype.worker = function (node, rawInputs, outputs, _a) {
        var _b, _c, _d;
        var thoth = _a.thoth;
        return __awaiter(this, void 0, void 0, function () {
            var completion, stringInputs, inputs, string, template, prompt, stop, temperature, maxTokens, body, raw, result, composed;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        completion = thoth.completion;
                        stringInputs = rawInputs;
                        inputs = Object.entries(stringInputs).reduce(function (acc, _a) {
                            var key = _a[0], value = _a[1];
                            acc[key] = value[0];
                            return acc;
                        }, {});
                        string = node.data.fewshot || "";
                        template = Handlebars.compile(string);
                        prompt = template(inputs);
                        stop = ((_b = node === null || node === void 0 ? void 0 : node.data) === null || _b === void 0 ? void 0 : _b.stop)
                            ? node.data.stop.split(",").map(function (i) { return i.trim(); })
                            : ["/n"];
                        temperature = ((_c = node === null || node === void 0 ? void 0 : node.data) === null || _c === void 0 ? void 0 : _c.temp) ? parseFloat(node.data.temp) : 0.7;
                        maxTokens = ((_d = node === null || node === void 0 ? void 0 : node.data) === null || _d === void 0 ? void 0 : _d.maxTokens)
                            ? parseInt(node.data.maxTokens)
                            : 50;
                        body = {
                            prompt: prompt,
                            stop: stop,
                            maxTokens: maxTokens,
                            temperature: temperature,
                        };
                        return [4 /*yield*/, completion(body)];
                    case 1:
                        raw = _e.sent();
                        result = raw === null || raw === void 0 ? void 0 : raw.trim();
                        composed = prompt + " " + result;
                        return [2 /*return*/, {
                                result: result,
                                composed: composed,
                            }];
                }
            });
        });
    };
    return Generator;
}(ThothReteComponent));
export { Generator };
