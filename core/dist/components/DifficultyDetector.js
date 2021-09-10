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
// For simplicity quests should be ONE thing not complete X and Y
var fewshot = "Given an action, predict how hard it would be for a normal human in a fantasy world and what type of stat it uses.\n\nStat Types: strength, dexterity, endurance, intelligence, charisma\n\nAction, Difficulty, Type: throw an anvil at the man, 8/20, strength\nAction, Difficulty, Type: cast a fireball spell, 6/20, intelligence\nAction, Difficulty, Type: I'm confident that I can kill the dragon! 2/20, charisma\nAction, Difficulty, Type: convince the king to give you his kingdom, 13/20, charisma\nAction, Difficulty, Type: talk to the merchant, 1/20, charisma\nAction, Difficulty, Type: ask the man if you can jump on his back and ride him around, 11/20, charisma\nAction, Difficulty, Type: pick up the mountain, 20/20, strength\nAction, Difficulty, Type: enter the room and tell the governor that you'll slay the dragon, 4/20, charisma\nAction, Difficulty, Type: run away, 4/20, dexterity\nAction, Difficulty, Type: ask why the dragon has been attacking people, 2/20, charisma\nAction, Difficulty, Type: say something wise, 6/20, intelligence\nAction, Difficulty, Type: sees a massive dragon flying over head, 7/20, Luck\nAction, Difficulty, Type: attack the Dragon, 6/20, strength\nAction, Difficulty, Type: continue harder and harder, 6/20, endurance\nAction, Difficulty, Type: feel pity for the gnome, 1/20, charisma\nAction, Difficulty, Type: set up a small blanket and pour the dragon a drink, 2/20, dexterity\nAction, Difficulty, Type: says \"wait are you leaving me?\", 2/20, charisma\nAction, Difficulty, Type: leap over the chasm, 7/20, dexterity\nAction, Difficulty, Type: talk to the bartender who gives you a pile of gold, 11/20, Luck\nAction, Difficulty, Type: climb up the mountain, 6/20, endurance\nAction, Difficulty, Type: goes to talk to the king, 2/20, charisma\nAction, Difficulty, Type: ask who the evil demon king is, 2/20, charisma\nAction, Difficulty, Type: do a back flip, 6/20, dexterity\nAction, Difficulty, Type: ";
var info = "The difficulty detector will attempt to tell you the difficulty of an action out of 20 in the format 5/20, as well as the stat category.  The categories it will attempt to classify the action into are:\n\nstrength, dexterity, endurance, intelligence, charisma\n\nYou can also view and edit the fewshot in the text editor.  Note however that you must keep the same data format for the component to properly format the completion response.\n";
var DifficultyDetectorComponent = /** @class */ (function (_super) {
    __extends(DifficultyDetectorComponent, _super);
    function DifficultyDetectorComponent() {
        var _this = 
        // Name of the component
        _super.call(this, "Difficulty Detector") || this;
        _this.displayControl = {};
        _this.task = {
            outputs: { difficulty: "output", category: "output", trigger: "option" },
            init: function (task) { },
        };
        _this.category = "AI/ML";
        _this.info = info;
        _this.display = true;
        return _this;
    }
    DifficultyDetectorComponent.prototype.builder = function (node) {
        node.data.fewshot = fewshot;
        var inp = new Rete.Input("action", "Action", stringSocket);
        var difficultyOut = new Rete.Output("difficulty", "Difficulty", stringSocket);
        var categoryOut = new Rete.Output("category", "Category", stringSocket);
        var triggerInput = new Rete.Input("trigger", "Trigger", triggerSocket);
        var triggerOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
        var fewshotControl = new FewshotControl({});
        node.inspector.add(fewshotControl);
        return node
            .addInput(inp)
            .addInput(triggerInput)
            .addOutput(triggerOutput)
            .addOutput(difficultyOut)
            .addOutput(categoryOut);
    };
    DifficultyDetectorComponent.prototype.worker = function (node, inputs, outputs, _a) {
        var silent = _a.silent, thoth = _a.thoth;
        return __awaiter(this, void 0, void 0, function () {
            var completion, action, prompt, body, raw, result, _b, difficulty, category;
            return __generator(this, function (_c) {
                switch (_c.label) {
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
                        raw = _c.sent();
                        result = raw === null || raw === void 0 ? void 0 : raw.trim();
                        if (!silent)
                            node.display(result);
                        _b = result
                            ? result.split(", ")
                            : [undefined, undefined], difficulty = _b[0], category = _b[1];
                        return [2 /*return*/, {
                                difficulty: difficulty,
                                category: category,
                            }];
                }
            });
        });
    };
    return DifficultyDetectorComponent;
}(ThothReteComponent));
export { DifficultyDetectorComponent };
