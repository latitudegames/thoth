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
import { DataControl } from "../plugins/inspectorPlugin";
var SocketGeneratorControl = /** @class */ (function (_super) {
    __extends(SocketGeneratorControl, _super);
    function SocketGeneratorControl(_a) {
        var _b = _a.socketType, socketType = _b === void 0 ? "anySocket" : _b, _c = _a.taskType, taskType = _c === void 0 ? "output" : _c, _d = _a.ignored, ignored = _d === void 0 ? [] : _d, _e = _a.icon, icon = _e === void 0 ? "properties" : _e, connectionType = _a.connectionType, nameInput = _a.name;
        var _this = this;
        if (!connectionType ||
            (connectionType !== "input" && connectionType !== "output"))
            throw new Error("connectionType of your generator must be defined and of the value 'input' or 'output'.");
        var name = nameInput || "Socket " + connectionType + "s";
        var options = {
            dataKey: connectionType + "s",
            name: name,
            component: "socketGenerator",
            icon: icon,
            data: {
                ignored: ignored,
                socketType: socketType,
                taskType: taskType,
                connectionType: connectionType,
            },
        };
        _this = _super.call(this, options) || this;
        _this.connectionType = connectionType;
        return _this;
    }
    return SocketGeneratorControl;
}(DataControl));
export { SocketGeneratorControl };
