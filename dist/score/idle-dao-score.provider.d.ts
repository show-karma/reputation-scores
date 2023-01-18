import { BaseProvider, DelegateStat, DelegateStatPeriod, GetDaoScore, ScoreBreakdownCalc, ScoreMultiplier } from "./interfaces";
export declare class IdleDaoScoreProvider extends BaseProvider implements GetDaoScore {
    weights: ScoreMultiplier;
    preload(daoName: string): Promise<void>;
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
    getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[];
    getScoreBreakdownCalc(stat: Partial<DelegateStat>, period?: DelegateStatPeriod, type?: "forum" | "score"): ScoreBreakdownCalc;
}
