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
import { InputControl } from "../dataControls/InputControl";
import { triggerSocket } from "../sockets";
import { v4 as uuidv4 } from "uuid";
var info = "The module trigger in adds a trigger input socket to the parent module.  It can be given a name, which is displayed on the parent.";
var ModuleTriggerIn = /** @class */ (function (_super) {
    __extends(ModuleTriggerIn, _super);
    function ModuleTriggerIn() {
        var _this = 
        // Name of the component
        // If name of component changes please update module-manager workerModule code
        _super.call(this, "Module Trigger In") || this;
        _this.nodeTaskMap = {};
        _this.contextMenuName = "Trigger In";
        _this.task = {
            outputs: {
                trigger: "option",
            },
            init: function (task, node) {
                // store the nodes task inside the component
                _this.nodeTaskMap[node.id] = task;
            },
        };
        _this.module = {
            nodeType: "triggerIn",
            socket: triggerSocket,
        };
        _this.category = "Module";
        _this.info = info;
        _this.workspaceType = "module";
        return _this;
    }
    ModuleTriggerIn.prototype.run = function (node, data) {
        return __awaiter(this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        task = this.nodeTaskMap[node.id];
                        return [4 /*yield*/, task.run(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // the builder is used to "assemble" the node component.
    // when we have enki hooked up and have grabbed all few shots, we would use the builder
    // to generate the appropriate inputs and ouputs for the fewshot at build time
    ModuleTriggerIn.prototype.builder = function (node) {
        var _a;
        // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
        var out = new Rete.Output("trigger", "Trigger", triggerSocket);
        node.data.socketKey = ((_a = node === null || node === void 0 ? void 0 : node.data) === null || _a === void 0 ? void 0 : _a.socketKey) || uuidv4();
        // Handle default value if data is present
        var nameInput = new InputControl({
            dataKey: "name",
            name: "Trigger name",
        });
        node.inspector.add(nameInput);
        return node.addOutput(out);
    };
    ModuleTriggerIn.prototype.worker = function (node, inputs, outputs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("trigger worker outputs", outputs);
                return [2 /*return*/, {}];
            });
        });
    };
    return ModuleTriggerIn;
}(Rete.Component));
export { ModuleTriggerIn };
