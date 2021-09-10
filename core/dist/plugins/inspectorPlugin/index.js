import { Inspector } from "./Inspector";
function install(editor) {
    var _a = editor.thothV2, onInspector = _a.onInspector, sendToInspector = _a.sendToInspector, clearTextEditor = _a.clearTextEditor;
    editor.on("componentregister", function (component) {
        var builder = component.builder;
        if (!component.info)
            throw new Error("All components must contain an info property describing the component to the end user.");
        // we are going to override the default builder with our own, and will invoke the original builder inside it.
        component.builder = function (node) {
            // This will unsubscribe us
            if (node.subscription)
                node.subscription();
            // Inspector class which will handle regsistering data controls, serializing, etc.
            node.inspector = new Inspector({ component: component, editor: editor, node: node });
            // Adding category to node for display on node
            node.category = component.category;
            node.info = component.info;
            // here we attach the default info control to the component which will show up in the inspector
            node.subscription = onInspector(node, function (data) {
                node.inspector.handleData(data);
                editor.trigger("nodecreated");
                // NOTE might still need this.  Keep an eye out.
                // sendToInspector(node.inspector.data());
            });
            builder.call(component, node);
        };
    });
    var currentNode;
    // handle publishing and subscribing to inspector
    editor.on("nodeselect", function (node) {
        if (currentNode && node.id === currentNode.id)
            return;
        currentNode = node;
        clearTextEditor();
        sendToInspector(node.inspector.data());
    });
}
export { DataControl } from "./DataControl";
var defaultExport = {
    name: "inspector",
    install: install,
};
export default defaultExport;
