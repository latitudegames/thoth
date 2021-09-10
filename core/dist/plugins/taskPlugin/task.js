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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Task = /** @class */ (function () {
    function Task(inputs, component, node, worker) {
        var _this = this;
        this.node = node;
        this.inputs = inputs;
        this.component = component;
        this.worker = worker;
        this.next = [];
        this.outputData = null;
        this.closed = [];
        this.getInputs("option").forEach(function (key) {
            _this.inputs[key].forEach(function (con) {
                con.task.next.push({ key: con.key, task: _this });
            });
        });
    }
    Task.prototype.getInputs = function (type) {
        var _this = this;
        return Object.keys(this.inputs)
            .filter(function (key) { return _this.inputs[key][0]; })
            .filter(function (key) { return _this.inputs[key][0].type === type; });
    };
    Task.prototype.getInputFromConnection = function (socketKey) {
        var input = null;
        Object.entries(this.inputs).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (value.some(function (con) { return con && con.key === socketKey; })) {
                input = key;
            }
        });
        return input;
    };
    Task.prototype.reset = function () {
        this.outputData = null;
    };
    Task.prototype.run = function (data, options) {
        if (data === void 0) { data = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, needReset, _b, garbage, _c, propagate, fromSocket, inputs_1, socketInfo, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = options.needReset, needReset = _a === void 0 ? true : _a, _b = options.garbage, garbage = _b === void 0 ? [] : _b, _c = options.propagate, propagate = _c === void 0 ? true : _c, fromSocket = options.fromSocket;
                        if (needReset)
                            garbage.push(this);
                        if (!!this.outputData) return [3 /*break*/, 4];
                        inputs_1 = {};
                        // TODO seang: breaking cash
                        // here we run through all INPUTS connected to other OUTPUTS for the node.
                        // We run eachinput back to whatever node it is connected to.
                        // We run that nodes task run, and then return its output data and
                        // associate it with This nodes input key
                        return [4 /*yield*/, Promise.all(this.getInputs("output").map(function (key) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b;
                                var _this = this;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _a = inputs_1;
                                            _b = key;
                                            return [4 /*yield*/, Promise.all(this.inputs[key].map(function (con) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, con.task.run(data, {
                                                                    needReset: false,
                                                                    garbage: garbage,
                                                                    propagate: false,
                                                                })];
                                                            case 1:
                                                                _a.sent();
                                                                return [2 /*return*/, con.task.outputData[con.key]];
                                                        }
                                                    });
                                                }); }))];
                                        case 1:
                                            _a[_b] = _c.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        // TODO seang: breaking cash
                        // here we run through all INPUTS connected to other OUTPUTS for the node.
                        // We run eachinput back to whatever node it is connected to.
                        // We run that nodes task run, and then return its output data and
                        // associate it with This nodes input key
                        _e.sent();
                        socketInfo = {
                            target: fromSocket ? this.getInputFromConnection(fromSocket) : null,
                        };
                        _d = this;
                        return [4 /*yield*/, this.worker(this, inputs_1, data, socketInfo)];
                    case 2:
                        _d.outputData = _e.sent();
                        if (this.component.task.onRun)
                            this.component.task.onRun(this.node, this, data, socketInfo);
                        if (!propagate) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.all(this.next
                                .filter(function (con) { return !_this.closed.includes(con.key); })
                                // pass the socket that is being calledikno
                                .map(function (con) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, con.task.run(data, {
                                                needReset: false,
                                                garbage: garbage,
                                                fromSocket: con.key,
                                            })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }))];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        if (needReset)
                            garbage.map(function (t) { return t.reset(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Task.prototype.clone = function (root, oldTask, newTask) {
        var _this = this;
        if (root === void 0) { root = true; }
        var inputs = Object.assign({}, this.inputs);
        if (root)
            // prevent of adding this task to `next` property of predecessor
            this.getInputs("option").map(function (key) { return delete inputs[key]; });
        // replace old tasks with new copies
        else
            Object.keys(inputs).forEach(function (key) {
                inputs[key] = inputs[key].map(function (con) { return (__assign(__assign({}, con), { task: con.task === oldTask ? newTask : con.task })); });
            });
        var task = new Task(inputs, this.component, this.node, this.worker);
        // manually add a copies of follow tasks
        task.next = this.next.map(function (n) { return ({
            key: n.key,
            task: n.task.clone(false, _this, task),
        }); });
        return task;
    };
    return Task;
}());
export { Task };
