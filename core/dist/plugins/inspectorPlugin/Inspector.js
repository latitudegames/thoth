var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import Rete from "rete";
import deepEqual from "deep-equal";
import { v4 as uuidv4 } from "uuid";
import * as socketMap from "../../sockets";
var Inspector = /** @class */ (function () {
    function Inspector(_a) {
        var component = _a.component, editor = _a.editor, node = _a.node;
        // Stub of function.  Can be a nodes catch all onData
        this.onData = function () { };
        this.cache = {};
        this.component = component;
        this.editor = editor;
        this.dataControls = new Map();
        this.node = node;
        this.category = component.category;
        this.info = component.info;
    }
    Inspector.prototype._add = function (list, control, prop) {
        if (list.has(control.key))
            throw new Error("Item with key '" + control.key + "' already been added to the inspector");
        if (control[prop] !== null)
            throw new Error("Inspector has already been added to some control");
        // Attach the inspector to the incoming control instance
        control[prop] = this;
        control.editor = this.editor;
        control.node = this.node;
        control.component = this.component;
        control.id = uuidv4();
        list.set(control.dataKey, control);
    };
    Inspector.prototype.add = function (dataControl) {
        this._add(this.dataControls, dataControl, "inspector");
        dataControl.onAdd();
        return this;
    };
    Inspector.prototype.handleSockets = function (sockets, control, type) {
        var _this = this;
        // we assume all sockets are of the same type here
        // and that the data key is set to 'inputs' or 'outputs'
        var isOutput = type === "outputs";
        this.node.data[type] = sockets;
        // get all sockets currently on the node
        var existingSockets = [];
        this.node[type].forEach(function (out) {
            existingSockets.push(out.key);
        });
        var ignored = control.data.ignored || [];
        // outputs that are on the node but not in the incoming sockets is removed
        existingSockets
            .filter(function (existing) {
            return !sockets.some(function (incoming) { return incoming.socketKey === existing; });
        })
            // filter out any sockets which we have set to be ignored
            .filter(function (existing) {
            return ignored.length === 0 || ignored.some(function (socket) { return socket !== existing; });
        })
            // iterate over each socket after this to remove is
            .forEach(function (key) {
            var socket = _this.node[type].get(key);
            // we get the connections for the node and remove that connection
            var connections = _this.node
                .getConnections()
                .filter(function (con) { return con[type.slice(0, -1)].key === key; });
            if (connections)
                connections.forEach(function (con) {
                    _this.editor.removeConnection(con);
                });
            // handle removing the socket, either output or input
            if (isOutput) {
                _this.node.removeOutput(socket);
            }
            else {
                _this.node.removeInput(socket);
            }
        });
        // any incoming outputs not on the node already are new and will be added.
        var newSockets = sockets.filter(function (socket) { return !existingSockets.includes(socket.socketKey); });
        // Here we are running over and ensuring that the outputs are in the tasks outputs
        // We only need to do this with outputs, as inputs don't need to be in the task
        if (isOutput) {
            this.component.task.outputs = this.node.data.outputs.reduce(function (acc, out) {
                acc[out.socketKey] = out.taskType || "output";
                return acc;
            }, __assign({}, this.component.task.outputs));
        }
        // Iterate over any new sockets and add them
        newSockets.forEach(function (socket) {
            // get the right constructor method for the socket
            var SocketConstructor = isOutput ? Rete.Output : Rete.Input;
            // use the provided information from the socket to generate it
            var newSocket = new SocketConstructor(socket.socketKey || socket.name.toLowerCase(), socket.name, socketMap[socket.socketType]);
            if (isOutput) {
                _this.node.addOutput(newSocket);
            }
            else {
                _this.node.addInput(newSocket);
            }
        });
    };
    Inspector.prototype.cacheControls = function (dataControls) {
        var cache = Object.entries(dataControls).reduce(function (acc, _a) {
            var key = _a[0], _b = _a[1].expanded, expanded = _b === void 0 ? true : _b;
            acc[key] = {
                expanded: expanded,
            };
            return acc;
        }, {});
        this.node.data.dataControls = cache;
    };
    Inspector.prototype.handleData = function (update) {
        var _a;
        // store all data controls inside the nodes data
        // WATCH in case our graphs start getting quite large.
        if (update.dataControls)
            this.cacheControls(update.dataControls);
        var data = update.data;
        // Send data to a possibel node global handler
        this.onData(data);
        // go over each data control
        for (var _i = 0, _b = this.dataControls; _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], control = _c[1];
            var isEqual = deepEqual(this.cache[key], data[key]);
            // compare agains the cache to see if it has changed
            if (isEqual)
                continue;
            // Write the data to the node, unless the control has specified otherwise
            if (control.write)
                this.node.data = __assign(__assign({}, this.node.data), (_a = {}, _a[key] = data[key], _a));
            // if there is inputs in the data, only handle the incoming sockets
            if (key === "inputs" && data["inputs"]) {
                this.handleSockets(data["inputs"], control.control, "inputs");
                continue;
            }
            // if there is outputs in the data, only handle the incoming sockets
            if (key === "outputs" && data["outputs"]) {
                this.handleSockets(data["outputs"], control.control, "outputs");
                continue;
            }
            if (data[key]) {
                // handle the situation where a control is setting inputs and outputs itself
                if (data[key].outputs) {
                    this.handleSockets(data[key].outputs, control.control, "outputs");
                }
                if (data[key].inputs) {
                    console.log("handling inputs", data[key]);
                    this.handleSockets(data[key].inputs, control.control, "inputs");
                }
            }
            // only call onData if it exists
            if (!(control === null || control === void 0 ? void 0 : control.onData))
                continue;
            control.onData(data[key]);
        }
        this.cache = data;
        // update the node at the end ofthid
        this.node.update();
    };
    Inspector.prototype.get = function (key) { };
    // returns all data prepared for the pubsub to send it.
    Inspector.prototype.data = function () {
        var _this = this;
        var dataControls = Array.from(this.dataControls.entries()).reduce(function (acc, _a) {
            var _b, _c;
            var key = _a[0], val = _a[1];
            var cache = (_c = (_b = _this.node) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.dataControls;
            var cachedControl = cache && cache[key] ? cache[key] : {};
            // use the data method on controls to get data shape
            acc[key] = __assign(__assign({}, val.control), cachedControl);
            return acc;
        }, {});
        return {
            name: this.node.name,
            nodeId: this.node.id,
            dataControls: dataControls,
            data: this.node.data,
            category: this.node.category,
            info: this.node.info,
        };
    };
    Inspector.prototype.remove = function (key) { };
    return Inspector;
}());
export { Inspector };
