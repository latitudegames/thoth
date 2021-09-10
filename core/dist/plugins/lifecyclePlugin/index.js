import { getHook } from './utils';
function install(editor) {
    editor.on('nodecreated', function (node) {
        return getHook(editor, node.name, 'created')(node);
    });
    editor.on('noderemoved', function (node) {
        return getHook(editor, node.name, 'destroyed')(node);
    });
    editor.on('connectioncreate', function (_a) {
        var _b, _c;
        var input = _a.input, output = _a.output;
        if (getHook(editor, (_b = input.node) === null || _b === void 0 ? void 0 : _b.name, 'onconnect')(input) === false ||
            getHook(editor, (_c = output.node) === null || _c === void 0 ? void 0 : _c.name, 'onconnect')(output) === false)
            return false;
    });
    editor.on('connectioncreated', function (connection) {
        var _a, _b;
        getHook(editor, (_a = connection.input.node) === null || _a === void 0 ? void 0 : _a.name, 'connected')(connection);
        getHook(editor, (_b = connection.output.node) === null || _b === void 0 ? void 0 : _b.name, 'connected')(connection);
    });
    editor.on('connectionremove', function (connection) {
        var _a, _b;
        if (getHook(editor, (_a = connection.input.node) === null || _a === void 0 ? void 0 : _a.name, 'ondisconnect')(connection) === false ||
            getHook(editor, (_b = connection.output.node) === null || _b === void 0 ? void 0 : _b.name, 'ondisconnect')(connection) === false)
            return false;
    });
    editor.on('connectionremoved', function (connection) {
        var _a, _b;
        getHook(editor, (_a = connection.input.node) === null || _a === void 0 ? void 0 : _a.name, 'disconnected')(connection);
        getHook(editor, (_b = connection.output.node) === null || _b === void 0 ? void 0 : _b.name, 'disconnected')(connection);
    });
}
export * from './interfaces';
var plugin = {
    name: 'lifecycle',
    install: install
};
export default plugin;
