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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Node, Socket, Control } from "rete-react-render-plugin";
import Icon, { componentCategories } from "../Icon/Icon";
import css from "./Node.module.css";
var MyNode = /** @class */ (function (_super) {
    __extends(MyNode, _super);
    function MyNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyNode.prototype.render = function () {
        var _a = this.props, node = _a.node, bindSocket = _a.bindSocket, bindControl = _a.bindControl;
        var _b = this.state, outputs = _b.outputs, controls = _b.controls, inputs = _b.inputs, selected = _b.selected;
        return (_jsxs("div", __assign({ className: css["node"] + " " + css[selected] }, { children: [_jsxs("div", __assign({ className: css["node-title"] }, { children: [_jsx(Icon, { name: componentCategories[node.category], style: { marginRight: "var(--extraSmall)" } }, void 0), node.data.name ? node.name + " - " + node.data.name : node.name] }), void 0), _jsxs("div", __assign({ className: css["connections-container"] }, { children: [inputs.length > 0 && (_jsx("div", __assign({ className: css["connection-container"] }, { children: inputs.map(function (input) { return (_jsxs("div", __assign({ className: css["input"] }, { children: [_jsx(Socket, { type: "input", socket: input.socket, io: input, innerRef: bindSocket }, void 0), !input.showControl() && (_jsx("div", __assign({ className: "input-title" }, { children: input.name }), void 0)), input.showControl() && (_jsx(Control, { className: "input-control", control: input.control, innerRef: bindControl }, void 0))] }), input.key)); }) }), void 0)), outputs.length > 0 && (_jsx("div", __assign({ className: css["connection-container"] + " " + css["out"] }, { children: outputs.map(function (output) { return (_jsxs("div", __assign({ className: css["output"] }, { children: [_jsx("div", __assign({ className: "output-title" }, { children: output.name }), void 0), _jsx(Socket, { type: "output", socket: output.socket, io: output, innerRef: bindSocket }, void 0)] }), output.key)); }) }), void 0))] }), void 0), _jsx("div", __assign({ className: css["bottom-container"] }, { children: controls.map(function (control) { return (_jsx(Control, { className: css["control"], control: control, innerRef: bindControl }, control.key)); }) }), void 0)] }), void 0));
    };
    return MyNode;
}(Node));
export { MyNode };
