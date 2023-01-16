import axios from "axios";
import { ScoreMultiplier } from "../interfaces";
const githubUrl = (resourceName: string) =>
  `https://raw.githubusercontent.com/show-karma/dao-score-multiplier/main/${resourceName}.json`;

const multipliers: Record<string, ScoreMultiplier> = {};

export async function getMultipliers(
  daoName: string | "default"
): Promise<ScoreMultiplier> {
  if (multipliers[daoName]) {
    return multipliers[daoName];
  }
  const { data: resource } = await axios.get<ScoreMultiplier>(
    githubUrl(daoName ?? "default")
  );
  multipliers[daoName] = resource;
  return resource;
}

/**
 * Checks if a value is falsy and returns a replacement if so.
 * Otherwise keeps the current value.
 * @param value
 * @param replacement
 */
export function coalesce(value: number, replacement = 0) {
  return value || replacement;
}
