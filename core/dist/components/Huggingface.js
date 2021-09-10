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
var info = "The huggingface component is used to access models on huggingface.co.  For now it is very simple.  You define a number of inputs with the input generator, and you can use those in forming the request to your huggingface inference model.  You input the name of the mode from hugginface into the model name field, and you run it.  It will call the model, and return the result.\n\nNOTE:  Hugginface models are on deman, and sometimes require time to \"boot up\".  We have tried to trigger an initial request the cause the model to load in th ebackground while you and working, but this will not always be done in time. If it is not done, we will notify you via the \"error\" trigger out.\n\nAlso note that you will likely need to parse the return from huggingfacwe yourself inside a code component, or similar.";
var HuggingfaceComponent = /** @class */ (function (_super) {
    __extends(HuggingfaceComponent, _super);
    function HuggingfaceComponent() {
        var _this = _super.call(this, "Huggingface") || this;
        _this.task = {
            outputs: {
                result: "output",
                trigger: "option",
                error: "option",
            },
        };
        _this.category = "AI/ML";
        _this.info = info;
        return _this;
    }
    HuggingfaceComponent.prototype.builder = function (node) {
        var triggerIn = new Rete.Input("trigger", "Trigger", triggerSocket);
        var triggerOut = new Rete.Output("trigger", "Trigger", triggerSocket);
        var errorOut = new Rete.Output("error", "Error", triggerSocket);
        var resultOut = new Rete.Output("result", "Result", stringSocket);
        node
            .addInput(triggerIn)
            .addOutput(triggerOut)
            .addOutput(resultOut)
            .addOutput(errorOut);
        var nameControl = new InputControl({
            dataKey: "name",
            name: "Component Name",
        });
        var inputGenerator = new SocketGeneratorControl({
            connectionType: "input",
            name: "Input Sockets",
            ignored: ["trigger"],
        });
        var requestControl = new FewshotControl({
            dataKey: "request",
            name: "Request",
            language: "handlebars",
        });
        var stopControl = new InputControl({
            dataKey: "modelName",
            name: "Model Name",
        });
        node.inspector
            .add(nameControl)
            .add(inputGenerator)
            .add(requestControl)
            .add(stopControl);
        return node;
    };
    HuggingfaceComponent.prototype.worker = function (node, rawInputs, outputs, _a) {
        var thoth = _a.thoth;
        return __awaiter(this, void 0, void 0, function () {
            var stringInputs, inputs, string, template, request, model, result, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._task.closed = ["error"];
                        stringInputs = rawInputs;
                        inputs = Object.entries(stringInputs).reduce(function (acc, _a) {
                            var key = _a[0], value = _a[1];
                            acc[key] = value[0];
                            return acc;
                        }, {});
                        string = node.data.request || "";
                        template = Handlebars.compile(string);
                        request = template(inputs);
                        model = node.data.model || "roberta-large-mnli";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, thoth.huggingface(model, request)];
                    case 2:
                        result = _b.sent();
                        if (result.error)
                            throw Error();
                        console.log("huggingfave result", result);
                        return [2 /*return*/, {
                                result: result,
                            }];
                    case 3:
                        err_1 = _b.sent();
                        console.log("err", err_1);
                        this._task.closed = ["trigger"];
                        return [2 /*return*/, {}];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return HuggingfaceComponent;
}(ThothReteComponent));
export { HuggingfaceComponent };
