var Restrictor = /** @class */ (function () {
    function Restrictor(editor, scaleExtent, translateExtent) {
        this.editor = editor;
        this.scaleExtent = scaleExtent;
        this.translateExtent = translateExtent;
        if (scaleExtent)
            editor.on("zoom", this.restrictZoom.bind(this));
        if (translateExtent)
            editor.on("translate", this.restrictTranslate.bind(this));
    }
    Restrictor.prototype.restrictZoom = function (data) {
        var se = typeof this.scaleExtent === "boolean"
            ? { min: 0.1, max: 1 }
            : this.scaleExtent;
        // const tr = data.transform;
        if (data.zoom < se.min)
            data.zoom = se.min;
        else if (data.zoom > se.max)
            data.zoom = se.max;
    };
    Restrictor.prototype.restrictTranslate = function (data) {
        var te = typeof this.translateExtent === "boolean"
            ? { width: 5000, height: 4000 }
            : this.translateExtent;
        var container = this.editor.view.container;
        var k = data.transform.k;
        var _a = [te.width * k, te.height * k], kw = _a[0], kh = _a[1];
        var cx = container.clientWidth / 2;
        var cy = container.clientHeight / 2;
        data.x -= cx;
        data.y -= cy;
        if (data.x > kw)
            data.x = kw;
        else if (data.x < -kw)
            data.x = -kw;
        if (data.y > kh)
            data.y = kh;
        else if (data.y < -kh)
            data.y = -kh;
        data.x += cx;
        data.y += cy;
    };
    return Restrictor;
}());
export { Restrictor };
