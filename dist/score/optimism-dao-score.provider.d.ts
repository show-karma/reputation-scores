import { BaseProvider, DelegateStat, GetDaoScore } from "./interfaces";
export declare class OptimismDaoScoreProvider extends BaseProvider implements GetDaoScore {
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
}
