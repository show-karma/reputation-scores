import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import { DelegateStat, DelegateStatPeriod, ScoreBreakdownCalc } from "./interfaces";
export declare class GitcoinDaoPercentileScoreProvider extends DefaultDaoScoreProvider {
    getKarmaScore(stat: Partial<DelegateStat>): number;
    getForumScore(stat: Partial<DelegateStat>): number;
    getScoreBreakdownCalc(stat: Partial<DelegateStat>, period?: DelegateStatPeriod): ScoreBreakdownCalc;
}
