"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = exports.DelegateStatPeriod = void 0;
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
    // abstract getScoreBreakdownCalc(): ScoreBreakdownCalc;
    toProviderDescriptor() {
        return {
            cls: this.constructor.name,
            args: this.args,
        };
    }
}
exports.BaseProvider = BaseProvider;
