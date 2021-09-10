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
var fewshot = function (prose) {
    var prompt = "Rewrite narrative snippets as a script:\n\n1\nOriginal text:\n\n\"I won't repeat what you're about to say,\" Professor Quirrell said, smiling.\nThey both laughed, then Harry turned serious again. \"The Sorting Hat did seem to think I was going to end up as a Dark Lord unless I went to Hufflepuff,\" Harry said. \"But I don't want to be one.\"\n\"Mr. Potter...\" said Professor Quirrell. \"Don't take this the wrong way. I promise you will not be graded on the answer. I only want to know your own, honest reply. Why not?\"\nHarry had that helpless feeling again. Thou shalt not become a Dark Lord was such an obvious theorem in his moral system that it was hard to describe the actual proof steps. \"Um, people would get hurt?\"\n\"Surely you've wanted to hurt people,\" said Professor Quirrell. \"You wanted to hurt those bullies today. Being a Dark Lord means that people you want to hurt get hurt.\"\nHarry floundered for words and then decided to simply go with the obvious. \"First of all, just because I want to hurt someone doesn't mean it's right -\"\n\"What makes something right, if not your wanting it?\"\n\"Ah,\" Harry said, \"preference utilitarianism.\"\n\"Pardon me?\" said Professor Quirrell.\n\nRewritten as a script:\n\n- Professor Quirrell: I won't repeat what you're about to say.\n- Harry: The Sorting Hat did seem to think I was going to end up as a Dark Lord unless I went to Hufflepuff. But I don't want to be one.\n- Professor Quirrell: Mr. Potter... Don't take this the wrong way. I promise you will not be graded on the answer. I only want to know your own, honest reply. Why not?\n- Harry: Um, people would get hurt?\n- Professor Quirrell: Surely you've wanted to hurt people. You wanted to hurt those bullies today. Being a Dark Lord means that people you want to hurt get hurt.\n- Harry: First of all, just because I want to hurt someone doesn't mean it's right -\n- Professor Quirrell: What makes something right, if not your wanting it?\n- Harry: Ah, preference utilitarianism.\n- Professor Quirrell: Pardon me?\n\n2\nOriginal text:\n\nQuickly, he continued. \"Nowadays, Mr. Bohlen, the hand-made article hasn't a hope. It can't possibly compete with mass-production, especially in this country \u2014 you know that. Carpets ... chairs ... shoes ...bricks ... crockery ... anything you like to mention \u2014 they're all made by machinery now. The quality may be inferior, but that doesn't matter. It's the cost of production that counts. And stories \u2014 well \u2014 they're just another product, like carpets and chairs, and no one cares how you produce them so long as you deliver the goods. We'll sell them wholesale, Mr. Bohlen! We'll undercut every writer in the country! We'll take the market!\" \n\"But seriously now, Knipe. D'you really think they'd buy them?\" \n\"Listen, Mr. Bohlen. Who on earth is going to want custom-made stories when they can get the other kind at half the price? It stands to reason, doesn't it?\"\n\"And how will you sell them? Who will you say has written them?\" \n\nRewritten as a script:\n\n- Knipe: Nowadays, Mr. Bohlen, the hand-made article hasn't a hope. It can't possibly compete with mass-production, especially in this country \u2014 you know that. Carpets ... chairs ... shoes ...bricks ... crockery ... anything you like to mention \u2014 they're all made by machinery now. The quality may be inferior, but that doesn't matter. It's the cost of production that counts. And stories \u2014 well \u2014 they're just another product, like carpets and chairs, and no one cares how you produce them so long as you deliver the goods. We'll sell them wholesale, Mr. Bohlen! We'll undercut every writer in the country! We'll take the market!\n- Mr. Bohlen: But seriously now, Knipe. D'you really think they'd buy them?\n- Knipe: Listen, Mr. Bohlen. Who on earth is going to want custom-made stories when they can get the other kind at half the price? It stands to reason, doesn't it?\n- Mr. Bohlen: And how will you sell them? Who will you say has written them?\n\n3\nOriginal text:\n\n" + prose + "\n\nRewritten as a script:\n\n-";
    return prompt;
};
var info = "The prose to script converter transforms narrative prose into a screenplay-style script, attributing dialogue to characters in the scene, and discarding all text that is not speech. The input is a text string the output is a string of the script";
var ProseToScript = /** @class */ (function (_super) {
    __extends(ProseToScript, _super);
    function ProseToScript() {
        var _this = 
        // Name of the component
        _super.call(this, "Prose to Script") || this;
        _this.task = {
            outputs: { detectedItem: "output", trigger: "option" },
            init: function (task) { },
        };
        _this.category = "AI/ML";
        _this.display = true;
        _this.info = info;
        return _this;
    }
    ProseToScript.prototype.builder = function (node) {
        node.data.fewshot = fewshot;
        var inp = new Rete.Input("string", "Text", stringSocket);
        var out = new Rete.Output("script", "Script", stringSocket);
        var dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
        var dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
        //const fewshotControl = new FewshotControl();
        //node.inspector.add(fewshotControl);
        return node
            .addInput(inp)
            .addInput(dataInput)
            .addOutput(out)
            .addOutput(dataOutput);
    };
    ProseToScript.prototype.worker = function (node, inputs, outputs, _a) {
        var silent = _a.silent, thoth = _a.thoth;
        return __awaiter(this, void 0, void 0, function () {
            var completion, prose, prompt, body, raw, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        completion = thoth.completion;
                        prose = inputs["string"][0];
                        prompt = fewshot(prose);
                        body = {
                            prompt: prompt,
                            stop: ["\n4"],
                            maxTokens: 300,
                            temperature: 0.0,
                        };
                        return [4 /*yield*/, completion(body)];
                    case 1:
                        raw = _b.sent();
                        result = raw === null || raw === void 0 ? void 0 : raw.trim();
                        if (!silent)
                            node.display(result);
                        return [2 /*return*/, {
                                detectedItem: result,
                            }];
                }
            });
        });
    };
    return ProseToScript;
}(ThothReteComponent));
export { ProseToScript };
