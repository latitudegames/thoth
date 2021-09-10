export function getHook(editor, name, method) {
    if (!name)
        return function () { return null; };
    var component = editor.getComponent(name);
    if (method in component) {
        var c = component;
        var func = c[method];
        return func.bind(component);
    }
    return function () { return null; };
}
