import axios, { AxiosError } from "axios";
import { ScoreMultiplier } from "../interfaces";
const githubUrl = (resourceName: string) =>
  `https://raw.githubusercontent.com/show-karma/dao-score-multiplier/main/${resourceName}.json`;

const multipliers: Record<string, ScoreMultiplier> = {};

export async function getMultipliers(
  resourceName: "default" | string
): Promise<ScoreMultiplier> {
  if (multipliers[resourceName]) {
    return multipliers[resourceName];
  }
  try {
    const { data: resource } = await axios.get<ScoreMultiplier>(
      githubUrl(resourceName || "default")
    );
    multipliers[resourceName] = resource;
    return resource;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response.status === 404) {
      return getMultipliers("default");
    }
  }
}

/**
 * Checks if a value is falsy and returns a replacement if so.
 * Otherwise keeps the current value.
 * @param value
 * @param replacement
 */
export function coalesce(value: string | number, replacement = 0) {
  return value && !Number.isNaN(+value) ? +value : replacement;
}
