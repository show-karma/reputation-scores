"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coalesce = exports.getTotalWeight = exports.getWeights = void 0;
const axios_1 = __importStar(require("axios"));
const githubUrl = (resourceName) => `https://raw.githubusercontent.com/show-karma/reputation-scores/main/src/util/weights/${resourceName}.json`;
const weights = {};
async function getWeights(resourceName) {
    if (weights[resourceName])
        return weights[resourceName];
    try {
        const { data: resource } = await axios_1.default.get(githubUrl(resourceName || "default"));
        return resource;
    }
    catch (err) {
        if (err instanceof axios_1.AxiosError && err.response?.status === 404) {
            return getWeights("default");
        }
    }
}
exports.getWeights = getWeights;
/**
 * Gets the sum of all weights container in a Multiplier object and
 * by default multiply by 100.
 * @param obj the weight definition
 * @param pct If false, won't multiply weights by 100
 * @returns
 */
const getTotalWeight = (obj, pct = true) => Object.keys(obj).reduce((acc, cur) => (acc += coalesce(obj[cur], 1)), 0) *
    (pct ? 100 : 1);
exports.getTotalWeight = getTotalWeight;
/**
 * Checks if a value is falsy and returns a replacement if so.
 * Otherwise keeps the current value.
 *
 *
 * ### Example
 * ```ts
 * coalesce(value, 1)
 * // 1, as value is undefined
 *
 * const value = 2;
 * coalesce(value, 1)
 * // 2, as value is defined
 *
 * const value = null;
 * coalesce(value, 1)
 * // 1, as value is falsy
 * ```
 *
 * @param value
 * @param replacement
 */
function coalesce(value, replacement = 0) {
    return value && !Number.isNaN(+value) ? +value : replacement;
}
exports.coalesce = coalesce;
