import { BaseProvider, DelegateStat, GetDaoScore } from "./interfaces";

export class DefaultDaoPercentileScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  // max here 100 + 20 + 10 + 30 + 5 + 1 = 166
  getForumScore(stat: Partial<DelegateStat>): number {
    return Math.round(
        (stat.proposalsInitiatedPercentile * 1 +
          stat.proposalsDiscussedPercentile * 0.2 +
          stat.forumPostCountPercentile * 0.1 +
          stat.forumTopicCountPercentile * 0.3 +
          stat.forumLikesReceivedPercentile * 0.05 +
          stat.forumPostsReadCountPercentile * 0.01) / 166 * 100
      ) || 0
    
  }

  // max here 100 + 300 + 500 + 1 = 901
  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    return Math.round(
        (stat.forumActivityScore +
          (stat.offChainVotesPct || 0) * 3 +
          (stat.onChainVotesPct || 0) * 5 +
          (stat.discordMessagePercentile || 0) * 0.01) / 901 * 100
      ) || 0
    
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "forumActivityScore",
      "offChainVotesPct",
      "onChainVotesPct",
      "discordMessagePercentile",
    ];
  }
}
