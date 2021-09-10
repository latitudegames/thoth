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
import { jsx as _jsx } from "react/jsx-runtime";
import { Control } from "rete";
var ReactRunButton = function (props) {
    var onButton = function () {
        var node = props.getNode();
        props.emitter.trigger("run", { nodeId: node.id });
    };
    return _jsx("button", __assign({ onClick: onButton }, { children: "RUN" }), void 0);
};
var RunButtonControl = /** @class */ (function (_super) {
    __extends(RunButtonControl, _super);
    function RunButtonControl(_a) {
        var key = _a.key, emitter = _a.emitter, run = _a.run;
        var _this = _super.call(this, key) || this;
        _this.render = "react";
        _this.key = key;
        _this.component = ReactRunButton;
        // we define the props that are passed into the rendered react component here
        _this.props = {
            emitter: emitter,
            run: run,
            getNode: _this.getNode.bind(_this),
        };
        return _this;
    }
    RunButtonControl.prototype.getNode = function () {
        return this.parent;
    };
    return RunButtonControl;
}(Control));
export { RunButtonControl };
