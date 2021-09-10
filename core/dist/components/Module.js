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
import isEqual from "lodash/isEqual";
import { ModuleControl } from "../dataControls/ModuleControl";
var info = "The Module component allows you to add modules into your chain.  A module is a bundled self contained chain that defines inputs, outputs, and triggers using components.";
var ModuleComponent = /** @class */ (function (_super) {
    __extends(ModuleComponent, _super);
    function ModuleComponent() {
        var _this = _super.call(this, "Module") || this;
        _this.subscriptionMap = {};
        _this.module = {
            nodeType: "module",
        };
        _this.task = {
            outputs: {},
        };
        _this.category = "Core";
        _this.info = info;
        _this.noBuildUpdate = true;
        return _this;
    }
    ModuleComponent.prototype.builder = function (node) {
        var _this = this;
        var moduleControl = new ModuleControl({
            name: "Module select",
            write: false,
        });
        if (node.data.module) {
            this.subscribe(node);
        }
        moduleControl.onData = function (moduleName) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.updateSockets(node, moduleName);
                this.subscribe(node);
                return [2 /*return*/];
            });
        }); };
        node.inspector.add(moduleControl);
        return node;
    };
    ModuleComponent.prototype.destroyed = function (node) {
        this.unsubscribe(node);
    };
    ModuleComponent.prototype.unsubscribe = function (node) {
        if (!this.subscriptionMap[node.id])
            return;
        this.subscriptionMap[node.id].unsubscribe();
        delete this.subscriptionMap[node.id];
    };
    ModuleComponent.prototype.subscribe = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var cache, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!node.data.module)
                            return [2 /*return*/];
                        this.unsubscribe(node);
                        _a = this.subscriptionMap;
                        _b = node.id;
                        return [4 /*yield*/, this.editor.thothV2.findOneModule({ name: node.data.module }, function (module) {
                                if (cache && !isEqual(cache, module.toJSON())) {
                                    // make sure that the module manager has the latest updated version of the module
                                    _this.editor.moduleManager.updateModule(module.toJSON());
                                    _this.updateSockets(node, module.name);
                                }
                                cache = module.toJSON();
                            })];
                    case 1:
                        _a[_b] = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleComponent.prototype.updateSockets = function (node, moduleName) {
        node.data.module = moduleName;
        this.updateModuleSockets(node);
        this.editor.trigger("process");
        node.update();
    };
    ModuleComponent.prototype.worker = function (node, inputs, outputs, _a) {
        var module = _a.module;
        var open = Object.entries(module.outputs)
            .filter(function (_a) {
            var key = _a[0], value = _a[1];
            return typeof value === "boolean" && value;
        })
            .map(function (_a) {
            var key = _a[0];
            return key;
        });
        // close all triggers first
        this._task.closed = node.data.outputs
            .map(function (out) { return out.name; })
            .filter(function (out) { return !open.includes(out); });
        return module.outputs;
    };
    return ModuleComponent;
}(Rete.Component));
export { ModuleComponent };
