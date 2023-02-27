import { ScoreMultiplier } from "../score/interfaces";
export declare function getWeights(resourceName: "default" | string): Promise<ScoreMultiplier>;
/**
 * Gets the sum of all weights container in a Multiplier object and
 * by default multiply by 100.
 * @param obj the weight definition
 * @param pct If false, won't multiply weights by 100
 * @returns
 */
export declare const getTotalWeight: (obj: Record<string, number>, pct?: boolean) => number;
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
export declare function coalesce(value: string | number | undefined, replacement?: number): number;
