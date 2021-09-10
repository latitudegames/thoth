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
import { TextInputControl } from "../controls/TextInputControl";
import { stringSocket, arraySocket } from "../sockets";
var info = "The Join List component takes in an array, and will join each item in the array together with a seperator, defined in the components input field.";
var JoinListComponent = /** @class */ (function (_super) {
    __extends(JoinListComponent, _super);
    function JoinListComponent() {
        var _this = 
        // Name of the component
        _super.call(this, "Join List") || this;
        _this.task = {
            outputs: {
                text: "output",
                trigger: "option",
            },
            init: function (task) { },
        };
        _this.category = "Logic";
        _this.info = info;
        return _this;
    }
    // the builder is used to "assemble" the node component.
    // when we have enki hooked up and have grabbed all few shots, we would use the builder
    // to generate the appropriate inputs and ouputs for the fewshot at build time
    JoinListComponent.prototype.builder = function (node) {
        // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
        var out = new Rete.Output("text", "String", stringSocket);
        var inputList = new Rete.Input("list", "List", arraySocket);
        // Handle default value if data is present
        var separator = node.data.separator ? node.data.separator : " ";
        // controls are the internals of the node itself
        // This default control sample has a text field.
        var input = new TextInputControl({
            emitter: this.editor,
            key: "separator",
            value: separator,
        });
        return node.addOutput(out).addControl(input).addInput(inputList);
    };
    // the worker contains the main business logic of the node.  It will pass those results
    // to the outputs to be consumed by any connected components
    JoinListComponent.prototype.worker = function (node, inputs, outputs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        text: inputs.list[0].join(node.data.separator),
                    }];
            });
        });
    };
    return JoinListComponent;
}(ThothReteComponent));
export { JoinListComponent };
