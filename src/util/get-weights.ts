import axios, { AxiosError } from "axios";
import { ScoreMultiplier } from "../score/interfaces";
const githubUrl = (resourceName: string) =>
  `https://raw.githubusercontent.com/show-karma/dao-score-multiplier/main/${resourceName}.json`;

export async function getWeights(
  resourceName: "default" | string
): Promise<ScoreMultiplier> {
  try {
    const { data: resource } = await axios.get<ScoreMultiplier>(
      githubUrl(resourceName || "default")
    );
    return resource;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response.status === 404) {
      return getWeights("default");
    }
  }
}

/**
 * Gets the sum of all weights container in a Multiplier object and
 * by default multiply by 100.
 * @param obj the weight definition
 * @param pct If false, won't multiply weights by 100
 * @returns
 */
export const getTotalWeight = (
  obj: Record<string, number>,
  pct: boolean = true
) =>
  Object.keys(obj).reduce((acc, cur) => (acc += coalesce(obj[cur], 1)), 0) *
  (pct ? 100 : 1);

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
export function coalesce(value: string | number, replacement = 0) {
  return value && !Number.isNaN(+value) ? +value : replacement;
}
