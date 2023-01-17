import { BaseProvider, DelegateStat, DelegateStatPeriod, GetDaoScore, ScoreBreakdownCalc } from "./interfaces";
export declare class DefaultDaoPercentileScoreProvider extends BaseProvider implements GetDaoScore {
    getScoreBreakdownCalc(stat: Partial<DelegateStat>, period?: DelegateStatPeriod): ScoreBreakdownCalc;
    preload(resourceName: string): Promise<void>;
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
    getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[];
}
