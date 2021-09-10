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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import Action from '../action';
var NodeAction = /** @class */ (function (_super) {
    __extends(NodeAction, _super);
    function NodeAction(editor, node) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.node = node;
        return _this;
    }
    return NodeAction;
}(Action));
var AddNodeAction = /** @class */ (function (_super) {
    __extends(AddNodeAction, _super);
    function AddNodeAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddNodeAction.prototype.undo = function () {
        this.editor.removeNode(this.node);
    };
    AddNodeAction.prototype.redo = function () {
        this.editor.addNode(this.node);
    };
    return AddNodeAction;
}(NodeAction));
export { AddNodeAction };
var RemoveNodeAction = /** @class */ (function (_super) {
    __extends(RemoveNodeAction, _super);
    function RemoveNodeAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemoveNodeAction.prototype.undo = function () {
        this.editor.addNode(this.node);
    };
    RemoveNodeAction.prototype.redo = function () {
        this.editor.removeNode(this.node);
    };
    return RemoveNodeAction;
}(NodeAction));
export { RemoveNodeAction };
var DragNodeAction = /** @class */ (function (_super) {
    __extends(DragNodeAction, _super);
    function DragNodeAction(editor, node, prev) {
        var _this = _super.call(this, editor, node) || this;
        _this.prev = __spreadArray([], prev, true);
        _this.new = __spreadArray([], node.position, true);
        return _this;
    }
    DragNodeAction.prototype._translate = function (position) {
        var _a;
        (_a = this.editor.view.nodes.get(this.node)).translate.apply(_a, position);
    };
    DragNodeAction.prototype.undo = function () {
        this._translate(this.prev);
    };
    DragNodeAction.prototype.redo = function () {
        this._translate(this.new);
    };
    DragNodeAction.prototype.update = function (node) {
        this.new = __spreadArray([], node.position, true);
    };
    return DragNodeAction;
}(NodeAction));
export { DragNodeAction };
