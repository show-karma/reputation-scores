import { BaseProvider, DelegateStat, GetDaoScore } from "./interfaces";
export declare class DefaultDaoPercentileScoreProvider extends BaseProvider implements GetDaoScore {
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
    getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[];
}
