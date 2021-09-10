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
import { stringSocket, triggerSocket, arraySocket } from "../sockets";
import { FewshotControl } from "../dataControls/FewshotControl";
var fewshot = "Given an action, detect what entities the player is interacting with. Ignore entities that the player is just asking about.\n\nEntity types: food, person, creature, object, place, other, none\n\nAction: throw an anvil at the man\nEntities: anvil, man\nTypes: object (use), person (target)\n\nAction: cast a fireball spell\nEntities: none\nTypes: none\n\nAction: convince the king to give you his kingdom\nEntities: king, kingdom\nTypes: person (target), object (dialog)\n\nAction: talk to the merchant\nEntities: merchant\nTypes: person (target)\n\nAction: ask where the bandit leader is\nEntities: bandit leader\nTypes: person (dialog)\n\nAction: leap over the chasm\nEntities: chasm\nTypes: location (target)\n\nAction: climb up the mountain\nEntities: mountain\nTypes: location (target)\n\nAction: throw a stone at the goblin\nEntities: stone, goblin\nTypes: object (use), creature (target)\n\nAction: run away from the orcs\nEntities: orcs\nTypes: creature (target)\n\nAction: ask how that relates to the dragon\nEntities: none\nTypes: none\n\nAction: ask the baker to give you a free loaf of bread\nEntities: baker, loaf of bread\nTypes: person (target), food (dialog)\n\nAction: get the merchant to give you better prices\nEntities: merchant\nTypes: person (target)\n\nAction: keep hiking\nEntities: none\nTypes: none\n\nAction: convince the bartender to give you the deed to his tavern\nEntities: bartender, tavern deed\nTypes: person (target), object (dialog)\n\nAction: go to the woman's home\nEntities: woman's home\nTypes: location (target)\n\nAction: ask the man for some water\nEntities: man, water\nTypes: person (target), object (dialog)\n\nAction: Jump onto your horse\nEntities: horse\nTypes: creature (target)\n\nAction: invent a new spell\nEntities: none\nTypes: none\n\nAction: ask the bartender for a machine gun\nEntities: bartender, machine gun\nTypes: person (target), object (dialog)\n\nAction: ask why the dragon attacked\nEntities: dragon\nTypes: creature (dialog)\n\nAction: cast a torchlight spell\nEntities: none\nTypes: none\n\nAction: ask where Zolarius the wizard is\nEntities: Zolarius the wizard\nTypes: person (dialog)\n\nAction: throw a pie at the waitress\nEntities: pie, waitress\nTypes: food (use), person (target)\n\nAction: ask where the wizard is\nEntities: wizard\nTypes: person (dialog)\n\nAction: draw your sword and fights the wolves\nEntities: sword, wolves\nTypes: object (use), creature (target)\n\nAction: ";
var info = "The entity detector takes in an action as a string, and attempts to report any discrete entities are mentioned, and their general type.\n\nThe fewshot can be edited in the text edior, though note that the data structure must remian the same for proper processing.";
var EntityDetector = /** @class */ (function (_super) {
    __extends(EntityDetector, _super);
    function EntityDetector() {
        var _this = 
        // Name of the component
        _super.call(this, "Entity Detector") || this;
        _this.task = {
            outputs: {
                entities: "output",
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
    EntityDetector.prototype.builder = function (node) {
        node.data.fewshot = fewshot;
        // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
        var inp = new Rete.Input("action", "Action", stringSocket);
        var out = new Rete.Output("entities", "Entities", arraySocket);
        var dataInput = new Rete.Input("trigger", "Trigger", triggerSocket);
        var dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
        var fewshotControl = new FewshotControl({});
        node.inspector.add(fewshotControl);
        return node
            .addInput(inp)
            .addInput(dataInput)
            .addOutput(dataOutput)
            .addOutput(out);
    };
    // the worker contains the main business logic of the node.  It will pass those results
    // to the outputs to be consumed by any connected components
    EntityDetector.prototype.worker = function (node, inputs, outputs, _a) {
        var _b, _c, _d;
        var silent = _a.silent, thoth = _a.thoth;
        return __awaiter(this, void 0, void 0, function () {
            var completion, action, prompt, body, result, split, _e, entities, types, i, allEntities;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        completion = thoth.completion;
                        action = inputs["action"][0];
                        prompt = node.data.fewshot + action + "\nEntities:";
                        body = {
                            prompt: prompt,
                            stop: ["\n\n"],
                            maxTokens: 50,
                            temperature: 0.0,
                        };
                        return [4 /*yield*/, completion(body)];
                    case 1:
                        result = _f.sent();
                        split = (_c = (_b = result === null || result === void 0 ? void 0 : result.replace("\n", "")) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.split("Types: ");
                        _e = split
                            ? split.map(function (item) { return item.split(", ").map(function (x) { return x.trim(); }); })
                            : [undefined, undefined], entities = _e[0], types = _e[1];
                        if (!entities || entities.length === 0)
                            return [2 /*return*/, []];
                        if (!types)
                            return [2 /*return*/, []];
                        for (i = 0; i < entities.length; i++) {
                            if ((_d = types[i]) === null || _d === void 0 ? void 0 : _d.includes("(dialog)")) {
                                types.splice(i, 1);
                                entities.splice(i, 1);
                            }
                        }
                        if (entities[0] === "none")
                            return [2 /*return*/, []];
                        allEntities = entities.map(function (entity, i) { return ({
                            name: entity,
                            type: types[i],
                        }); });
                        if (!silent)
                            node.display(JSON.stringify(allEntities));
                        return [2 /*return*/, {
                                entities: allEntities,
                            }];
                }
            });
        });
    };
    return EntityDetector;
}(ThothReteComponent));
export { EntityDetector };
