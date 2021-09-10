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
import { DataControl } from "../DataControl";
var InfoControl = /** @class */ (function (_super) {
    __extends(InfoControl, _super);
    function InfoControl(_a) {
        var dataKey = _a.dataKey, name = _a.name, info = _a.info;
        var _this = this;
        var options = {
            dataKey: dataKey,
            name: name,
            component: "info",
            icon: "info",
            data: {
                info: info,
            },
        };
        _this = _super.call(this, options) || this;
        return _this;
    }
    InfoControl.prototype.onData = function (data) {
        return;
    };
    return InfoControl;
}(DataControl));
export { InfoControl };
