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
          (stat.offChainVotesPct || 0) * 5 +
          (stat.onChainVotesPct || 0) * 2 +
          (stat.delegatedVotes/1000)
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | 'median')[] {
    return ['offChainVotesPct', 'onChainVotesPct', 'delegatedVotes'];
  }
}
