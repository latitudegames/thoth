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
import Action from '../action';
// The saved connection may have been removed and recreated, so make sure we are working with the correct reference
function findNewConnection(oldConnection) {
    var input = oldConnection.input, output = oldConnection.output;
    return output.connections.find(function (c) { return c.input === input; });
}
var ConnectionActionHelper = /** @class */ (function () {
    function ConnectionActionHelper(editor, connection) {
        this.editor = editor;
        this.connection = connection;
    }
    ConnectionActionHelper.prototype.add = function () {
        this.editor.connect(this.connection.output, this.connection.input);
    };
    ConnectionActionHelper.prototype.remove = function () {
        this.editor.removeConnection(findNewConnection(this.connection));
    };
    return ConnectionActionHelper;
}());
var AddConnectionAction = /** @class */ (function (_super) {
    __extends(AddConnectionAction, _super);
    function AddConnectionAction(editor, connection) {
        var _this = _super.call(this) || this;
        _this.helper = new ConnectionActionHelper(editor, connection);
        return _this;
    }
    AddConnectionAction.prototype.undo = function () { this.helper.remove(); };
    AddConnectionAction.prototype.redo = function () { this.helper.add(); };
    return AddConnectionAction;
}(Action));
export { AddConnectionAction };
var RemoveConnectionAction = /** @class */ (function (_super) {
    __extends(RemoveConnectionAction, _super);
    function RemoveConnectionAction(editor, connection) {
        var _this = _super.call(this) || this;
        _this.helper = new ConnectionActionHelper(editor, connection);
        return _this;
    }
    RemoveConnectionAction.prototype.undo = function () { this.helper.add(); };
    RemoveConnectionAction.prototype.redo = function () { this.helper.remove(); };
    return RemoveConnectionAction;
}(Action));
export { RemoveConnectionAction };
