import axios, { AxiosError } from "axios";
import { ScoreMultiplier } from "../score/interfaces";
const githubUrl = (resourceName: string) =>
  `https://raw.githubusercontent.com/show-karma/dao-score-multiplier/main/${resourceName}.json`;

/**
 * Runtime storage of the weight values. This will
 * ensure that the whole task will use the same values
 * event if it updates.
 */
const weights: Record<string, ScoreMultiplier> = {};

export async function getWeights(
  resourceName: "default" | string
): Promise<ScoreMultiplier> {
  if (weights[resourceName]) {
    return weights[resourceName];
  }
  try {
    const { data: resource } = await axios.get<ScoreMultiplier>(
      githubUrl(resourceName || "default")
    );
    weights[resourceName] = resource;
    return resource;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response.status === 404) {
      return getWeights("default");
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
