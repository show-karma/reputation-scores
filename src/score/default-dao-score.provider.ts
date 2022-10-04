import { BaseProvider, DelegateStat, GetDaoScore } from "./interfaces";

export class DefaultDaoScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  getForumScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        stat.proposalsInitiated * 1 +
          stat.proposalsDiscussed * 0.2 +
          stat.forumPostCount * 0.1 +
          stat.forumTopicCount * 0.3 +
          stat.forumLikesReceived * 0.05 +
          stat.forumPostsReadCount * 0.01
      ) || 0
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    return (
      Math.round(
        stat.forumActivityScore +
          (stat.offChainVotesPct || 0) * 3 +
          (stat.onChainVotesPct || 0) * 5 +
          (stat.discordMessagesCount || 0) * 0.01
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "forumActivityScore",
      "offChainVotesPct",
      "onChainVotesPct",
      "discordMessagesCount",
    ];
  }
}
