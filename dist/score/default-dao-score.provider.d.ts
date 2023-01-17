import { BaseProvider, DelegateStat, DelegateStatPeriod, GetDaoScore, ScoreBreakdownCalc, ScoreMultiplier } from "./interfaces";
export declare class DefaultDaoScoreProvider extends BaseProvider implements GetDaoScore {
    preload(resourceName: string): Promise<void>;
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
    getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[];
    weights: ScoreMultiplier;
    getScoreBreakdownCalc(stat: Partial<DelegateStat>, period?: DelegateStatPeriod): ScoreBreakdownCalc;
}
