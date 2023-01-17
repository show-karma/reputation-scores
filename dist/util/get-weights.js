"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coalesce = exports.getWeights = void 0;
const axios_1 = __importDefault(require("axios"));
const githubUrl = (resourceName) => `https://raw.githubusercontent.com/show-karma/dao-score-multiplier/main/${resourceName}.json`;
/**
 * Runtime storage of the weight values. This will
 * ensure that the whole task will use the same values
 * event if it updates.
 */
const weights = {};
async function getWeights(resourceName) {
    if (weights[resourceName]) {
        return weights[resourceName];
    }
    try {
        const { data: resource } = await axios_1.default.get(githubUrl(resourceName || "default"));
        weights[resourceName] = resource;
        return resource;
    }
    catch (err) {
        const error = err;
        if (error.response.status === 404) {
            return getWeights("default");
        }
    }
}
exports.getWeights = getWeights;
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
