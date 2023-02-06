import { BaseProvider, DelegateStat, DelegateStatPeriod, GetDaoScore, ScoreBreakdownCalc, ScoreMultiplier } from "./interfaces";
export declare class DefaultWithDiscordDaoScoreProvider extends BaseProvider implements GetDaoScore {
    weights: ScoreMultiplier;
    preload(resourceName?: string): Promise<void>;
    getScoreBreakdownCalc(stat: Partial<DelegateStat>, period?: DelegateStatPeriod, type?: "forum" | "score"): ScoreBreakdownCalc;
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
    getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[];
}
