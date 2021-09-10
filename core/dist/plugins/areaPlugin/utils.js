var min = function (arr) { return arr.length === 0 ? 0 : Math.min.apply(Math, arr); };
var max = function (arr) { return arr.length === 0 ? 0 : Math.max.apply(Math, arr); };
export function nodesBBox(editor, nodes) {
    var left = min(nodes.map(function (node) { return node.position[0]; }));
    var top = min(nodes.map(function (node) { return node.position[1]; }));
    var right = max(nodes.map(function (node) { return node.position[0] + editor.view.nodes.get(node).el.clientWidth; }));
    var bottom = max(nodes.map(function (node) { return node.position[1] + editor.view.nodes.get(node).el.clientHeight; }));
    return {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        width: Math.abs(left - right),
        height: Math.abs(top - bottom),
        getCenter: function () {
            return [
                (left + right) / 2,
                (top + bottom) / 2
            ];
        }
    };
}
