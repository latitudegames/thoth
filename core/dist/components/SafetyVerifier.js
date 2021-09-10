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
import { stringSocket, triggerSocket, booleanSocket } from "../sockets";
import { FewshotControl } from "../dataControls/FewshotControl";
var fewshot = "Rate the actions according to the following content categories\nX: Explicit sexual content, rape, cannibalism, incest\nM: Heavy violence, light sexual content, safe for adults\nT: Light violence, safe for teens.\nE: Safe for everyone\n\nAction: dodge and fire a silver arrow.\nRating: E\n\nAction: Kiss her chest\nRating: M\n\nAction: Cum in the pig's mouth\nRating: X\n\nAction: Lick the woman's pussy\nRating: X\n\nAction: Behead the peasant with your axe\nRating: M\n\nAction: pull out elon musks not a flamethrower to burn the dragon\nRating: T\n\nAction: melt gold in cave and cover dragon with the melted gold\nRating: T\n\nAction: Laughed you figured your sister and fucked your best friend.\nRating: X\n\nAction: pick up governor and toss him out the window like from the emperors groove, with him screaming SORRRY\nRating: T\n\nAction: Rub the woman's genitals\nRating: X\n\nAction: Stroke the persons boobs\nRating: X\n\nAction: Pick up the bartender\nRating: T\n\nAction: Ask the guard why he's here.\nRating: E\n\nAction: Release the biggest load in the universe\nRating: X\n\nAction: Cast a spell to summon a fireball\nRating: T\n\nAction: Have sex with her\nRating: X\n\nAction: Take out my flamethrower\nRating: T\n\nAction: Slice off the bandit's head\nRating: M\n\nAction: Jerk off\nRating: X\n\nAction: ";
var info = "The Safety Verifier component takes a string and attempts to classify if that string is safe or not.  It returns a boolean value that represents whether or not the input is safe.\n\nThe fewshot can be edited in the text editor, however it contains content which may be triggering to some individuals. If you modify the fewshot, note that it must remian in the format for the processing to work.";
var SafetyVerifier = /** @class */ (function (_super) {
    __extends(SafetyVerifier, _super);
    function SafetyVerifier() {
        var _this = 
        // Name of the component
        _super.call(this, "Safety Verifier") || this;
        _this.task = {
            outputs: {
                trigger: "option",
                boolean: "output",
            },
            init: function (task) { },
        };
        _this.category = "AI/ML";
        _this.display = true;
        _this.info = info;
        return _this;
    }
    SafetyVerifier.prototype.builder = function (node) {
        node.data.fewshot = fewshot;
        var inp = new Rete.Input("string", "Text", stringSocket);
        var dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
        var dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
        var out = new Rete.Output("boolean", "Boolean", booleanSocket);
        var fewshotControl = new FewshotControl({});
        node.inspector.add(fewshotControl);
        return node
            .addInput(inp)
            .addInput(dataInput)
            .addOutput(out)
            .addOutput(dataOutput);
    };
    SafetyVerifier.prototype.worker = function (node, inputs, outputs, _a) {
        var silent = _a.silent, thoth = _a.thoth;
        return __awaiter(this, void 0, void 0, function () {
            var completion, action, prompt, body, raw, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        completion = thoth.completion;
                        action = inputs["string"][0];
                        prompt = node.data.fewshot + action + "\nRating:";
                        body = {
                            prompt: prompt,
                            stop: ["\n"],
                            maxTokens: 10,
                            temperature: 0.0,
                        };
                        return [4 /*yield*/, completion(body)];
                    case 1:
                        raw = _b.sent();
                        result = (raw === null || raw === void 0 ? void 0 : raw.trim()) !== "X";
                        if (!silent)
                            node.display("" + result);
                        return [2 /*return*/, {
                                boolean: result,
                            }];
                }
            });
        });
    };
    return SafetyVerifier;
}(ThothReteComponent));
export { SafetyVerifier };
