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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Control } from "rete";
var ReactTextInputControl = function (props) {
    return _jsxs("p", __assign({ style: { width: 200 } }, { children: ["Result: ", props.display] }), void 0);
};
var DisplayControl = /** @class */ (function (_super) {
    __extends(DisplayControl, _super);
    function DisplayControl(_a) {
        var key = _a.key, _b = _a.defaultDisplay, defaultDisplay = _b === void 0 ? "" : _b;
        var _this = _super.call(this, key) || this;
        _this.render = "react";
        _this.key = key;
        _this.component = ReactTextInputControl;
        // we define the props that are passed into the rendered react component here
        _this.props = {
            display: defaultDisplay,
        };
        return _this;
    }
    DisplayControl.prototype.display = function (val) {
        this.props.display = val;
        this.putData("display", val);
        this.update();
    };
    return DisplayControl;
}(Control));
export { DisplayControl };
