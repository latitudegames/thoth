var History = /** @class */ (function () {
    function History() {
        this.active = false;
        this.produced = [];
        this.reserved = [];
    }
    History.prototype.add = function (action) {
        if (this.active)
            return;
        this.produced.push(action);
        this.reserved = [];
    };
    Object.defineProperty(History.prototype, "last", {
        get: function () {
            return this.produced[this.produced.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    History.prototype._do = function (from, to, type) {
        var action = from.pop();
        if (!action)
            return;
        this.active = true;
        action[type]();
        to.push(action);
        this.active = false;
    };
    History.prototype.undo = function () {
        this._do(this.produced, this.reserved, 'undo');
    };
    History.prototype.clear = function () {
        this.active = false;
        this.produced = [];
        this.reserved = [];
    };
    History.prototype.redo = function () {
        this._do(this.reserved, this.produced, 'redo');
    };
    return History;
}());
export default History;
