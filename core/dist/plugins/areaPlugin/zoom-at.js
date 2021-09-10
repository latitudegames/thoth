import { nodesBBox } from './utils';
export function zoomAt(editor, nodes) {
    if (nodes === void 0) { nodes = editor.nodes; }
    var bbox = nodesBBox(editor, nodes);
    var _a = bbox.getCenter(), x = _a[0], y = _a[1];
    var _b = [editor.view.container.clientWidth, editor.view.container.clientHeight], w = _b[0], h = _b[1];
    var area = editor.view.area;
    var _c = [w / bbox.width, h / bbox.height], kw = _c[0], kh = _c[1];
    var k = Math.min(kh * 0.9, kw * 0.9, 1);
    area.transform.x = area.container.clientWidth / 2 - x * k;
    area.transform.y = area.container.clientHeight / 2 - y * k;
    area.zoom(k, 0, 0);
    area.update();
}
