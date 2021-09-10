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
import { NodeEditor } from "rete";
import isEqual from "lodash/isEqual";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import HistoryPlugin from "./plugins/historyPlugin";
import LifecyclePlugin from "./plugins/lifecyclePlugin";
import AreaPlugin from "./plugins/areaPlugin";
import TaskPlugin from "./plugins/taskPlugin";
import InspectorPlugin from "./plugins/inspectorPlugin";
import SocketGenerator from "./plugins/socketGenerator";
import DisplayPlugin from "./plugins/displayPlugin";
import ModulePlugin from "./plugins/modulePlugin";
import { initSharedEngine } from "./engine";
import { components } from "./components/components";
var ThothEditor = /** @class */ (function (_super) {
    __extends(ThothEditor, _super);
    function ThothEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ThothEditor;
}(NodeEditor));
/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/
var editorTabMap = {};
var editor = function (_a) {
    var container = _a.container, pubSub = _a.pubSub, thoth = _a.thoth, tab = _a.tab, thothV2 = _a.thothV2, node = _a.node;
    return __awaiter(this, void 0, void 0, function () {
        var modules, editor, _b, engine;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (editorTabMap[tab.id])
                        editorTabMap[tab.id].clear();
                    modules = [];
                    editor = new ThothEditor("demo@0.1.0", container);
                    editorTabMap[tab.id] = editor;
                    // Set up the reactcontext pubsub on the editor so rete components can talk to react
                    editor.pubSub = pubSub;
                    editor.thoth = thoth;
                    editor.thothV2 = thothV2;
                    editor.tab = tab;
                    // History plugin for undo/redo
                    editor.use(HistoryPlugin, { keyboard: false });
                    // PLUGINS
                    // https://github.com/retejs/comment-plugin
                    // connection plugin is used to render conections between nodes
                    editor.use(ConnectionPlugin);
                    // React rendering for the editor
                    editor.use(ReactRenderPlugin, {
                        // this component parameter is a custom default style for nodes
                        component: node,
                    });
                    // renders a context menu on right click that shows available nodes
                    editor.use(LifecyclePlugin);
                    editor.use(ContextMenuPlugin, {
                        delay: 0,
                        rename: function (component) {
                            return component.contextMenuName || component.name;
                        },
                        allocate: function (component) {
                            var tabType = component.editor.tab.type;
                            var workspaceType = component.workspaceType;
                            if (workspaceType && workspaceType !== tabType)
                                return null;
                            return [component.category];
                        },
                    });
                    editor.use(TaskPlugin);
                    // This should only be needed on client, not server
                    editor.use(SocketGenerator);
                    editor.use(DisplayPlugin);
                    editor.use(InspectorPlugin);
                    editor.use(AreaPlugin, {
                        scaleExtent: { min: 0.25, max: 2 },
                    });
                    // handle modules
                    // NOTE watch this subscription as it may get intensive with lots of tabs open...
                    _b = editor;
                    return [4 /*yield*/, thothV2.getModules(function (moduleDocs) {
                            if (!moduleDocs)
                                return;
                            modules = moduleDocs
                                .map(function (doc) { return doc.toJSON(); })
                                .reduce(function (acc, module) {
                                // todo handle better mapping
                                // see moduleSelect.tsx
                                acc[module.name] = module;
                                return acc;
                            }, {});
                            // we only want to proceed if the incoming modules have changed.
                            if (isEqual(modules, editor.moduleManager.modules))
                                return;
                            editor.moduleManager.setModules(modules);
                            editor.trigger("save");
                        })];
                case 1:
                    // handle modules
                    // NOTE watch this subscription as it may get intensive with lots of tabs open...
                    _b.moduleSubscription = _c.sent();
                    // Register custom components with both the editor and the engine
                    // We will need a way to share components between client and server (@seang: this should be covered by upcoming package)
                    // WARNING all the plugins from the editor get installed onto the component and modify it.  This effects the components registered in the engine, which already have plugins installed.
                    components.forEach(function (c) {
                        editor.register(c);
                    });
                    engine = initSharedEngine("demo@0.1.0", modules, components);
                    // @seang TODO: update types for editor.use rather than casting as unknown here, we may want to bring our custom rete directly into the monorepo at this point 
                    editor.use(ModulePlugin, { engine: engine, modules: modules });
                    // @seang: moved these two functions to attempt to preserve loading order after the introduction of initSharedEngine
                    editor.on("zoom", function (_a) {
                        var source = _a.source;
                        return source !== "dblclick";
                    });
                    editor.bind("run");
                    editor.bind("save");
                    editor.on("process nodecreated noderemoved connectioncreated connectionremoved", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: 
                                // Here we would swap out local processing for an endpoint that we send the serialised JSON too.
                                // Then we run the fewshots, etc on the backend rather than on the client.
                                // Alternative for now is for the client to call our own /openai endpoint.
                                // NOTE need to consider authentication against Latitude API from a web client
                                return [4 /*yield*/, engine.abort()];
                                case 1:
                                    // Here we would swap out local processing for an endpoint that we send the serialised JSON too.
                                    // Then we run the fewshots, etc on the backend rather than on the client.
                                    // Alternative for now is for the client to call our own /openai endpoint.
                                    // NOTE need to consider authentication against Latitude API from a web client
                                    _a.sent();
                                    return [4 /*yield*/, engine.process(editor.toJSON(), null, { thoth: thothV2 })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    editor.abort = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, engine.abort()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    editor.loadGraph = function (graph) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, engine.abort()];
                                case 1:
                                    _a.sent();
                                    editor.fromJSON(graph);
                                    editor.view.resize();
                                    AreaPlugin.zoomAt(editor);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/, editor];
            }
        });
    });
};
export default editor;
