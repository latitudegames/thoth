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
import Rete from "rete";
// Note: We do this so Typescript knows what extra properties we're
// adding to the NodeEditor (in rete/editor.js). In an ideal world, we
// would be extending the class there, when we instantiate it.
var ThothReteNodeEditor = /** @class */ (function (_super) {
    __extends(ThothReteNodeEditor, _super);
    function ThothReteNodeEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ThothReteNodeEditor;
}(Rete.NodeEditor));
var ThothReteComponent = /** @class */ (function (_super) {
    __extends(ThothReteComponent, _super);
    function ThothReteComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ThothReteComponent;
}(Rete.Component));
export { ThothReteComponent };
