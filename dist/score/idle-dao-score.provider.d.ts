import { BaseProvider, DelegateStat, DelegateStatPeriod, GetDaoScore, ScoreBreakdownCalc } from "./interfaces";
export declare class IdleDaoScoreProvider extends BaseProvider implements GetDaoScore {
    getScoreBreakdownCalc(stat: Partial<DelegateStat>, period?: DelegateStatPeriod): ScoreBreakdownCalc;
    preload(daoName: string): Promise<void>;
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
    getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[];
}
