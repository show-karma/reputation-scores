import { BaseProvider, DelegateStat, GetDaoScore } from "./interfaces";
export declare class OptimismDaoScoreProvider extends BaseProvider implements GetDaoScore {
    preload(daoName: string): Promise<void>;
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
    getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[];
}
