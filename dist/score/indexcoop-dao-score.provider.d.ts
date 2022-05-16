import { DefaultDaoScoreProvider } from './default-dao-score.provider';
import { DelegateStat } from './interfaces';
export declare class IndexcoopDaoScoreProvider extends DefaultDaoScoreProvider {
    getKarmaScore(stat: Partial<DelegateStat>): number;
}
