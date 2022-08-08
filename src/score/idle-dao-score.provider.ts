import { BaseProvider, DelegateStat, GetDaoScore } from "./interfaces";

export class IdleDaoScoreProvider extends BaseProvider implements GetDaoScore {
  getForumScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        (stat.proposalsInitiated || 0) * 10 +
          (stat.proposalsDiscussed || 0) * 2 +
          (stat.forumPostCount || 0) +
          (stat.forumTopicCount || 0) * 3 +
          (stat.forumLikesReceived || 0) * 0.5 +
          (stat.forumPostsReadCount || 0) * 0.1
      ) || 0
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    return (
      Math.round(
        stat.delegatedVotes * 0.0005 +
          (stat.forumActivityScore || 0) +
          (stat.offChainVotesPct || 0) * 3 +
          (stat.discordMessagesCount || 0) * 0.01
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | 'median')[] {
    return ['delegatedVotes', 'forumActivityScore', 'offChainVotesPct', 'discordMessagesCount'];
  }
}
