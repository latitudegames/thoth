import { AddConnectionAction, RemoveConnectionAction, } from "./actions/connection";
import { AddNodeAction, DragNodeAction, RemoveNodeAction, } from "./actions/node";
import Act from "./action";
import History from "./history";
function trackNodes(editor, history) {
    editor.on("nodecreated", function (node) {
        return history.add(new AddNodeAction(editor, node));
    });
    editor.on("noderemoved", function (node) {
        return history.add(new RemoveNodeAction(editor, node));
    });
    editor.on("nodetranslated", function (_a) {
        var node = _a.node, prev = _a.prev;
        if (history.last instanceof DragNodeAction && history.last.node === node)
            history.last.update(node);
        else
            history.add(new DragNodeAction(editor, node, prev));
    });
}
function trackConnections(editor, history) {
    editor.on("connectioncreated", function (c) {
        return history.add(new AddConnectionAction(editor, c));
    });
    editor.on("connectionremoved", function (c) {
        return history.add(new RemoveConnectionAction(editor, c));
    });
}
// eslint-disable-next-line max-statements
function install(editor, _a) {
    var _b = _a.keyboard, keyboard = _b === void 0 ? true : _b;
    editor.bind("undo");
    editor.bind("redo");
    editor.bind("addhistory");
    var history = new History();
    editor.on("undo", function () { return history.undo(); });
    editor.on("redo", function () { return history.redo(); });
    editor.on("addhistory", function (action) { return history.add(action); });
    editor.on("clear", function () {
        history.clear();
    });
    if (keyboard)
        document.addEventListener("keydown", function (e) {
            if (!e.ctrlKey)
                return;
            console.log(e.code);
            switch (e.code) {
                case "KeyZ":
                    editor.trigger("undo");
                    break;
                case "KeyY":
                    editor.trigger("redo");
                    break;
                default:
            }
        });
    trackNodes(editor, history);
    trackConnections(editor, history);
}
export var Action = Act;
var defaultExport = {
    name: "history",
    install: install,
};
export default defaultExport;
