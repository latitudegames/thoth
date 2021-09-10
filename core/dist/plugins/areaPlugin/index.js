import "./style.css";
import { Background } from "./background";
import { Restrictor } from "./restrictor";
import { SnapGrid } from "./snap";
import { zoomAt } from "./zoom-at";
function install(editor, params) {
    var background = params.background || false;
    var snap = params.snap || false;
    var scaleExtent = params.scaleExtent || false;
    var translateExtent = params.translateExtent || false;
    if (background) {
        this._background = new Background(editor, background);
    }
    if (scaleExtent || translateExtent) {
        this._restrictor = new Restrictor(editor, scaleExtent, translateExtent);
    }
    if (snap) {
        this._snap = new SnapGrid(editor, snap);
    }
}
var plugin = {
    name: "Area Plugin",
    install: install,
    zoomAt: zoomAt,
};
export default plugin;
