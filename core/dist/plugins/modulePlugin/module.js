var Module = /** @class */ (function () {
    function Module() {
        this.inputs = {};
        this.outputs = {};
    }
    Module.prototype.read = function (inputs) {
        this.inputs = inputs;
    };
    Module.prototype.write = function (outputs) {
        var _this = this;
        Object.keys(this.outputs).forEach(function (key) {
            outputs[key] = _this.outputs[key];
        });
    };
    Module.prototype.getInput = function (key) {
        return this.inputs[key];
    };
    Module.prototype.setOutput = function (key, value) {
        this.outputs[key] = value;
    };
    return Module;
}());
export { Module };
