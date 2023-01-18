import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import { DelegateStat, DelegateStatPeriod, ScoreBreakdownCalc } from "./interfaces";
export declare class EnsDaoScoreProvider extends DefaultDaoScoreProvider {
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
    getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[];
    getScoreBreakdownCalc(stat: Partial<DelegateStat>, period?: DelegateStatPeriod, type?: "forum" | "score"): ScoreBreakdownCalc;
}
