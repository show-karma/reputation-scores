import { DefaultDaoScoreProvider } from './default-dao-score.provider';
import { DelegateStat } from './interfaces';

export class EnsDaoScoreProvider extends DefaultDaoScoreProvider {
  getForumScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        stat.proposalsInitiated * 10 +
          stat.proposalsDiscussed * 2 +
          stat.forumPostCount +
          stat.forumTopicCount * 3 +
          stat.forumLikesReceived * 0.5 +
          stat.forumPostsReadCount * 0.1
      ) || 0
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    return (
      Math.round(
        stat.forumActivityScore +
          (stat.offChainVotesPct || 0) * 3 +
          (stat.delegatedVotes > median ? 20 : 0)
      ) || 0
    );
  }
}
