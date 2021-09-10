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
var EnkiThroughputControl = /** @class */ (function (_super) {
    __extends(EnkiThroughputControl, _super);
    function EnkiThroughputControl(_a) {
        var _b = _a.socketType, socketType = _b === void 0 ? "String" : _b, _c = _a.taskType, taskType = _c === void 0 ? "output" : _c, nodeId = _a.nodeId, _d = _a.icon, icon = _d === void 0 ? "bird" : _d;
        var _this = this;
        var options = {
            dataKey: "throughputs-" + nodeId,
            name: "Enki Task Details",
            icon: icon,
            component: "enkiSelect",
            data: {
                activetask: {},
                socketType: socketType,
                taskType: taskType,
            },
        };
        _this = _super.call(this, options) || this;
        _this.socketType = socketType;
        return _this;
    }
    EnkiThroughputControl.prototype.onData = function (_a) {
        var activeTask = _a.activeTask;
        // These are already in the node.data from the Inspector running.  It does this for you by default, spacing it on under the output name
        this.node.data.name = (activeTask === null || activeTask === void 0 ? void 0 : activeTask.taskName) || "Enki Task";
        this.node.data.activetask = activeTask;
        this.node.update();
    };
    return EnkiThroughputControl;
}(DataControl));
export { EnkiThroughputControl };
