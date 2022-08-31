import { BaseProvider, DelegateStat, GetDaoScore } from "./interfaces";

export class OptimismDaoScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
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
    return Math.round(
      stat.delegatedVotes / 10000 + (stat.discordMessagesCount || 0) * 0.01
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return ["delegatedVotes", "discordMessagesCount"];
  }
}
