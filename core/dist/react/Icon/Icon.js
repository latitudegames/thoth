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
import css from "./icon.module.css";
export var componentCategories = {
    "AI/ML": "play-print",
    "I/O": "water",
    Logic: "switch",
    State: "state",
    Module: "cup",
    Core: "ankh",
};
export var dataControlCategories = {
    "Data Inputs": "properties",
    "Data Outputs": "properties",
    Fewshot: "fewshot",
    Stop: "stop-sign",
    Temperature: "temperature",
    "Max Tokens": "moon",
};
var Icon = function (_a) {
    var name = _a.name, size = _a.size, style = _a.style;
    if (!size)
        size = 16;
    if (!name)
        name = "warn";
    return (_jsx("div", { className: css["icon"] + " " + css[name], style: __assign({ height: size, width: size }, style) }, void 0));
};
export default Icon;
