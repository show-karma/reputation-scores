import { DefaultDaoScoreProvider } from './default-dao-score.provider';
import { DelegateStat } from './interfaces';

export class IndexcoopDaoScoreProvider extends DefaultDaoScoreProvider {
  getKarmaScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        (stat.onChainVotesPct || 0) * 5 + (stat.offChainVotesPct || 0) * 3
      ) || 0
    );
  }
}
