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
var fewshot = "Change each statement to be in the third person present tense and correct all grammar.\n\nMatt: am sleepy.\nThird Person: Matt is sleepy.\n---\nMatt: bllogha bloghs.\nThird Person: Matt makes nonsensical sounds.\n--\nJackson: tell the king that you won't help him.\nThird Person: Jackson tells the king that he won't help him.\n---\nJill: can I have a mug of ale?\nThird Person: Jill says, \"Can I have a mug of ale?\"\n---\nSam: say i'd be happy to help you\nThird Person: Sam says, \"I'd be happy to help you.\"\n---\nCogsworth: draw my sword of light and slice myself in the forehead.\nThird Person: Cogsworth draws his sword of light and slices himself in the forehead.\n---\nJon: say but you said I could have it. Please?\nThird Person: Jon says, \"But you said I could have it. Please?\"\n---\nEliza: ask my friend where he's going\nThird Person: Eliza asks her friend where he's going.\n---\nAaron: am sleepy.\nThird Person: Aaron is sleepy.\n---\nRobert: say I think I can resist it if you give me potion of Mind Shield. Do u have one?\nThird Person: Robert says, \"I think I can resist it if you give me a potion of Mind Shield. Do you have one?\"\n---\nJack: go talk to the knight\nThird Person: Jack goes to talk to the knight\n---\nJack: say What are you doing?!\nThird Person: Jack says, \"What are you doing?!\"\n---\nJames: I'm confident that I can kill the dragon!\nThird Person: James says, \"I'm confident that I can kill the dragon!\"\n---\nErica: want to go to the store but trip over my own shoes.\nThird Person: Erica wants to go to the store but she trips over her own shoes.\n---\nTom: told her that it was over.\nThird Person: Tom told her that it was over.\n---\nFred: ask what time is it?\nThird Person: Fred asks, \"What time is it?\"\n---\nJames: okay!\nThird Person: James says, \"Okay!\"\n--\nFred: command the mercenaries to attack the dragon while you rescue the princess.\nThird Person: Fred commands the mercenaries to attack the dragon while he rescues the princess.\n---\n";
var info = "The Tense Transformer will take any string and attempt to turn it into the first person present tense.  It requires a name and text as an input, and will output the result.\n\nYou can edit the fewshot in the text editor, but be aware that you must retain the fewshots data structure so processing will work.";
var TenseTransformer = /** @class */ (function (_super) {
    __extends(TenseTransformer, _super);
    function TenseTransformer() {
        var _this = 
        // Name of the component
        _super.call(this, "Tense Transformer") || this;
        _this.task = {
            outputs: {
                action: "output",
                trigger: "option",
            },
            init: function (task) { },
        };
        _this.category = "AI/ML";
        _this.display = true;
        _this.info = info;
        return _this;
    }
    // the builder is used to "assemble" the node component.
    // when we have enki hooked up and have grabbed all few shots, we would use the builder
    // to generate the appropriate inputs and ouputs for the fewshot at build time
    TenseTransformer.prototype.builder = function (node) {
        // Set fewshot into nodes data
        node.data.fewshot = fewshot;
        // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
        var textInput = new Rete.Input("text", "Text", stringSocket);
        var nameInput = new Rete.Input("name", "Name", stringSocket);
        var dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
        var dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
        var out = new Rete.Output("action", "Action", stringSocket);
        var fewshotControl = new FewshotControl({});
        node.inspector.add(fewshotControl);
        return node
            .addInput(dataInput)
            .addInput(textInput)
            .addInput(nameInput)
            .addOutput(out)
            .addOutput(dataOutput);
    };
    // the worker contains the main business logic of the node.  It will pass those results
    // to the outputs to be consumed by any connected components
    TenseTransformer.prototype.worker = function (node, inputs, outputs, _a) {
        var silent = _a.silent, thoth = _a.thoth;
        return __awaiter(this, void 0, void 0, function () {
            var completion, name, text, prompt, body, raw, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        completion = thoth.completion;
                        name = inputs.name, text = inputs.text;
                        prompt = "" + node.data.fewshot + name[0] + ": " + text[0] + "\nThird Person:";
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
                                action: result,
                            }];
                }
            });
        });
    };
    return TenseTransformer;
}(ThothReteComponent));
export { TenseTransformer };
