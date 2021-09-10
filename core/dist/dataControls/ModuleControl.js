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
var ModuleControl = /** @class */ (function (_super) {
    __extends(ModuleControl, _super);
    function ModuleControl(_a) {
        var name = _a.name, _b = _a.icon, icon = _b === void 0 ? "sieve" : _b, _c = _a.write, write = _c === void 0 ? false : _c;
        var _this = this;
        var options = {
            dataKey: "module",
            name: name,
            component: "moduleSelect",
            write: write,
            icon: icon,
        };
        _this = _super.call(this, options) || this;
        return _this;
    }
    return ModuleControl;
}(DataControl));
export { ModuleControl };
