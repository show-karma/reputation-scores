import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import { DelegateStat, DelegateStatPeriod, ScoreBreakdownCalc } from "./interfaces";
export declare class GitcoinDaoPercentileScoreProvider extends DefaultDaoScoreProvider {
    preload(_: string): Promise<void>;
    getKarmaScore(stat: Partial<DelegateStat>): number;
    getForumScore(stat: Partial<DelegateStat>): number;
    getScoreBreakdownCalc(stat: Partial<DelegateStat>, period?: DelegateStatPeriod, type?: "forum" | "score"): ScoreBreakdownCalc;
}
