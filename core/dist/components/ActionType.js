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
import { stringSocket, triggerSocket } from "../sockets";
import { FewshotControl } from "../dataControls/FewshotControl";
var fewshot = "Given an action classify the type of action it is\n\nTypes: look, get, use, craft, dialog, movement, travel, combat, consume, other\n\nAction, Type: pick up the bucket, get\nAction, Type: cast a fireball spell on the goblin, combat\nAction, Type: convince the king to give you his kingdom, dialog\nAction, Type: talk to the merchant, dialog\nAction, Type: leap over the chasm, movement\nAction, Type: climb up the mountain, travel\nAction, Type: throw a stone at the goblin, combat\nAction, Type: run away from the orcs, movement\nAction, Type: ask the baker to give you a free loaf of bread, dialog\nAction, Type: go to the forest, travel\nAction, Type: grab a torch off the wall, get\nAction, Type: throw your sword at the table, use\nAction, Type: journey to the city, travel\nAction, Type: drink your potion, use\nAction, Type: ";
var info = "The Action type component will take in an action as text, and attempt to classify it into a discrete number of categories:\n\nlook, get, use, craft, dialog, movement, travel, combat, consume, other.";
var ActionTypeComponent = /** @class */ (function (_super) {
    __extends(ActionTypeComponent, _super);
    function ActionTypeComponent() {
        var _this = 
        // Name of the component
        _super.call(this, "Action Type Classifier") || this;
        _this.task = {
            outputs: { actionType: "output", trigger: "option" },
            init: function (task) { },
        };
        _this.category = "AI/ML";
        _this.info = info;
        _this.display = true;
        return _this;
    }
    // the builder is used to "assemble" the node component.
    // when we have enki hooked up and have grabbed all few shots, we would use the builder
    // to generate the appropriate inputs and ouputs for the fewshot at build time
    ActionTypeComponent.prototype.builder = function (node) {
        node.data.fewshot = fewshot;
        // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
        var inp = new Rete.Input("action", "Action", stringSocket);
        var out = new Rete.Output("actionType", "ActionType", stringSocket);
        var dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
        var dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
        var fewshotControl = new FewshotControl({});
        node.inspector.add(fewshotControl);
        return node
            .addInput(inp)
            .addInput(dataInput)
            .addOutput(out)
            .addOutput(dataOutput);
    };
    // the worker contains the main business logic of the node.  It will pass those results
    // to the outputs to be consumed by any connsected components
    ActionTypeComponent.prototype.worker = function (node, inputs, outputs, _a) {
        var silent = _a.silent, thoth = _a.thoth;
        return __awaiter(this, void 0, void 0, function () {
            var completion, action, prompt, body, raw, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        completion = thoth.completion;
                        action = inputs["action"][0];
                        prompt = node.data.fewshot + action + ",";
                        body = {
                            prompt: prompt,
                            stop: ["\n"],
                            maxTokens: 100,
                            temperature: 0.0,
                        };
                        return [4 /*yield*/, completion(body)];
                    case 1:
                        raw = _b.sent();
                        result = raw === null || raw === void 0 ? void 0 : raw.trim();
                        if (!silent)
                            node.display(result);
                        return [2 /*return*/, {
                                actionType: result,
                            }];
                }
            });
        });
    };
    return ActionTypeComponent;
}(ThothReteComponent));
export { ActionTypeComponent };
