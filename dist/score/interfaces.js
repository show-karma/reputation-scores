"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = exports.DelegateStatPeriod = void 0;
var DelegateStatPeriod;
(function (DelegateStatPeriod) {
    DelegateStatPeriod["lifetime"] = "lifetime";
    DelegateStatPeriod["30d"] = "30d";
})(DelegateStatPeriod = exports.DelegateStatPeriod || (exports.DelegateStatPeriod = {}));
class BaseProvider {
    constructor(...args) {
        this.args = args;
    }
    toProviderDescriptor() {
        return {
            cls: this.constructor.name,
            args: this.args
        };
    }
}
exports.BaseProvider = BaseProvider;
