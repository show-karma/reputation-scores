"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreCalculator = exports.BaseProvider = exports.DelegateStatPeriod = void 0;
const calculator_1 = require("../util/calculator");
Object.defineProperty(exports, "ScoreCalculator", { enumerable: true, get: function () { return calculator_1.ScoreCalculator; } });
var DelegateStatPeriod;
(function (DelegateStatPeriod) {
    DelegateStatPeriod["lifetime"] = "lifetime";
    DelegateStatPeriod["7d"] = "7d";
    DelegateStatPeriod["30d"] = "30d";
    DelegateStatPeriod["90d"] = "90d";
    DelegateStatPeriod["180d"] = "180d";
    DelegateStatPeriod["1y"] = "1y";
})(DelegateStatPeriod = exports.DelegateStatPeriod || (exports.DelegateStatPeriod = {}));
class BaseProvider {
    constructor(...args) {
        this.args = args;
    }
    toProviderDescriptor() {
        return {
            cls: this.constructor.name,
            args: this.args,
        };
    }
}
exports.BaseProvider = BaseProvider;
