var SnapGrid = /** @class */ (function () {
    function SnapGrid(editor, _a) {
        var _this = this;
        var _b = _a.size, size = _b === void 0 ? 16 : _b, _c = _a.dynamic, dynamic = _c === void 0 ? true : _c;
        this.editor = editor;
        this.size = size;
        if (dynamic)
            this.editor.on("nodetranslate", this.onTranslate.bind(this));
        else
            this.editor.on("rendernode", function (_a) {
                var node = _a.node, el = _a.el;
                el.addEventListener("mouseup", _this.onDrag.bind(_this, node));
                el.addEventListener("touchend", _this.onDrag.bind(_this, node));
                el.addEventListener("touchcancel", _this.onDrag.bind(_this, node));
            });
    }
    SnapGrid.prototype.onTranslate = function (data) {
        var x = data.x, y = data.y;
        data.x = this.snap(x);
        data.y = this.snap(y);
    };
    SnapGrid.prototype.onDrag = function (node) {
        var _a = node.position, x = _a[0], y = _a[1];
        node.position[0] = this.snap(x);
        node.position[1] = this.snap(y);
        this.editor.view.nodes.get(node).update();
        this.editor.view.updateConnections({ node: node });
    };
    SnapGrid.prototype.snap = function (value) {
        return Math.round(value / this.size) * this.size;
    };
    return SnapGrid;
}());
export { SnapGrid };
