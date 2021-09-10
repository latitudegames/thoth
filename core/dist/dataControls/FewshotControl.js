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
var FewshotControl = /** @class */ (function (_super) {
    __extends(FewshotControl, _super);
    function FewshotControl(_a) {
        var _b = _a.language, language = _b === void 0 ? "plaintext" : _b, _c = _a.icon, icon = _c === void 0 ? "fewshot" : _c, _d = _a.dataKey, dataKey = _d === void 0 ? "fewshot" : _d, _e = _a.name, name = _e === void 0 ? "fewshot" : _e;
        var _this = this;
        var options = {
            dataKey: dataKey,
            name: name,
            component: "longText",
            icon: icon,
            options: {
                editor: true,
                language: language,
            },
        };
        _this = _super.call(this, options) || this;
        return _this;
    }
    FewshotControl.prototype.onData = function (data) {
        return;
    };
    return FewshotControl;
}(DataControl));
export { FewshotControl };
