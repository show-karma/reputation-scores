import { ScoreMultiplier } from "../score/interfaces";
export declare function getWeights(resourceName: "default" | string): Promise<ScoreMultiplier>;
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
export declare function coalesce(value: string | number, replacement?: number): number;
