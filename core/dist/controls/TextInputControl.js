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
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Control } from "rete";
var ReactTextInputControl = function (props) {
    var _a = useState(""), value = _a[0], setValue = _a[1];
    useEffect(function () {
        setValue(props.value);
        props.putData(props.name, props.value);
    }, [props]);
    var onChange = function (e) {
        props.putData(props.name, e.target.value);
        setValue(e.target.value);
    };
    return _jsx("input", { type: "text", value: value, onChange: onChange }, void 0);
};
var TextInputControl = /** @class */ (function (_super) {
    __extends(TextInputControl, _super);
    function TextInputControl(_a) {
        var emitter = _a.emitter, key = _a.key, value = _a.value;
        var _this = _super.call(this, key) || this;
        _this.render = "react";
        _this.component = ReactTextInputControl;
        // we define the props that are passed into the rendered react component here
        _this.props = {
            emitter: emitter,
            name: key,
            value: value,
            putData: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _this.putData.apply(_this, args);
            },
        };
        return _this;
    }
    return TextInputControl;
}(Control));
export { TextInputControl };
