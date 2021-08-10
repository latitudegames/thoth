import "./style.css";
import { Background } from "./background";
import { Restrictor } from "./restrictor";
import { SnapGrid } from "./snap";
import { zoomAt } from "./zoom-at";

function install(editor, params) {
  let background = params.background || false;
  let snap = params.snap || false;
  let scaleExtent = params.scaleExtent || false;
  let translateExtent = params.translateExtent || false;

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

const plugin = {
  name: "Area Plugin",
  install,
  zoomAt,
};

export default plugin;
