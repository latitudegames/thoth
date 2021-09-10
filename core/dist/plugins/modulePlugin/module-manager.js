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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Module } from "./module";
import { extractNodes } from "./utils";
var ModuleManager = /** @class */ (function () {
    function ModuleManager(modules) {
        this.inputs = new Map();
        this.outputs = new Map();
        this.triggerIns = new Map();
        this.triggerOuts = new Map();
        this.modules = modules;
        this.inputs = new Map();
        this.outputs = new Map();
        this.triggerIns = new Map();
        this.triggerOuts = new Map();
    }
    ModuleManager.prototype.addModule = function (module) {
        this.modules.push(module);
    };
    ModuleManager.prototype.setModules = function (modules) {
        this.modules = modules;
    };
    ModuleManager.prototype.updateModule = function (module) {
        this.modules[module.name] = module;
    };
    ModuleManager.prototype.getSockets = function (data, typeMap, defaultName) {
        var _this = this;
        return extractNodes(data.nodes, typeMap).map(function (node, i) {
            node.data.name = node.data.name || defaultName + "-" + (i + 1);
            return {
                name: node.data.name,
                socketKey: node.data.socketKey,
                socket: _this.socketFactory(node, typeMap.get(node.name)),
            };
        });
    };
    ModuleManager.prototype.getInputs = function (data) {
        return this.getSockets(data, this.inputs, "input");
    };
    ModuleManager.prototype.getOutputs = function (data) {
        return this.getSockets(data, this.outputs, "output");
    };
    ModuleManager.prototype.getTriggerOuts = function (data) {
        return this.getSockets(data, this.triggerOuts, "trigger");
    };
    ModuleManager.prototype.getTriggerIns = function (data) {
        return this.getSockets(data, this.triggerIns, "trigger");
    };
    ModuleManager.prototype.socketFactory = function (node, socket) {
        socket = typeof socket === "function" ? socket(node) : socket;
        if (!socket)
            throw new Error("Socket not found for node with id = " + node.id + " in the module");
        return socket;
    };
    ModuleManager.prototype.registerInput = function (name, socket) {
        this.inputs.set(name, socket);
    };
    ModuleManager.prototype.registerTriggerIn = function (name, socket) {
        this.triggerIns.set(name, socket);
    };
    ModuleManager.prototype.registerTriggerOut = function (name, socket) {
        this.triggerOuts.set(name, socket);
    };
    ModuleManager.prototype.registerOutput = function (name, socket) {
        this.outputs.set(name, socket);
    };
    ModuleManager.prototype.getTriggeredNode = function (data, socketKey) {
        return extractNodes(data.nodes, this.triggerIns).find(function (node) { return node.data.socketKey === socketKey; });
    };
    ModuleManager.prototype.workerModule = function (node, inputs, outputs, args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var data, module, engine, parsedInputs, triggeredNode, component;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!node.data.module)
                            return [2 /*return*/];
                        if (!this.modules[node.data.module])
                            return [2 /*return*/];
                        data = this.modules[node.data.module].data;
                        module = new Module();
                        engine = (_a = this.engine) === null || _a === void 0 ? void 0 : _a.clone();
                        parsedInputs = Object.entries(inputs).reduce(function (acc, _a) {
                            var key = _a[0], value = _a[1];
                            var name = node.data.inputs.find(function (n) { return n.socketKey === key; }).name;
                            acc[name] = value;
                            return acc;
                        }, {});
                        module.read(parsedInputs);
                        return [4 /*yield*/, (engine === null || engine === void 0 ? void 0 : engine.process(data, null, Object.assign({}, args, { module: module, silent: true })))];
                    case 1:
                        _c.sent();
                        if (!((_b = args === null || args === void 0 ? void 0 : args.socketInfo) === null || _b === void 0 ? void 0 : _b.target)) return [3 /*break*/, 3];
                        triggeredNode = this.getTriggeredNode(data, args.socketInfo.target);
                        component = engine === null || engine === void 0 ? void 0 : engine.components.get("Module Trigger In");
                        return [4 /*yield*/, (component === null || component === void 0 ? void 0 : component.run(triggeredNode))];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        // gather the outputs
                        module.write(outputs);
                        return [2 /*return*/, module];
                }
            });
        });
    };
    ModuleManager.prototype.workerInputs = function (node, inputs, outputs, _a) {
        var module = _a.module;
        if (!module)
            return;
        outputs["output"] = (module.getInput(node.data.name) || [])[0];
        return outputs;
    };
    ModuleManager.prototype.workerOutputs = function (node, inputs, outputs, _a) {
        var module = _a.module;
        if (!module)
            return;
        module.setOutput(node.data.socketKey, inputs["input"][0]);
    };
    ModuleManager.prototype.workerTriggerIns = function (node, inputs, outputs, _a) {
        var module = _a.module, rest = __rest(_a, ["module"]);
        if (!module)
            return;
        // module.setOutput(node.data.name, inputs["input"][0]);
    };
    ModuleManager.prototype.workerTriggerOuts = function (node, inputs, outputs, _a) {
        var module = _a.module, rest = __rest(_a, ["module"]);
        if (!module)
            return;
        module.setOutput(node.data.socketKey, outputs["trigger"]);
    };
    ModuleManager.prototype.setEngine = function (engine) {
        this.engine = engine;
    };
    return ModuleManager;
}());
export { ModuleManager };
