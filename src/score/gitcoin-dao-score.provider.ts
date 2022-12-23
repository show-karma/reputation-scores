import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import { DelegateStat } from "./interfaces";

export class GitcoinDaoScoreProvider extends DefaultDaoScoreProvider {
  getKarmaScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        stat.forumActivityScore +
          (stat.offChainVotesPct || 0) +
          (stat.discordMessagePercentile || 0) * 0.01
      ) || 0
    );
  }

  // 1660 sum of all forum props percentiles
  getForumScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
          ((stat.proposalsInitiatedPercentile || 0) * 10 +
          (stat.proposalsDiscussedPercentile || 0) * 2 +
          (stat.forumPostCountPercentile || 0) +
          (stat.forumTopicCountPercentile || 0) * 3 +
          (stat.forumLikesReceivedPercentile || 0) * 0.5 +
          (stat.forumPostsReadCountPercentile || 0) * 0.1) * 100 / 1660
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return ["forumActivityScore", "offChainVotesPct", "discordMessagesCount"];
  }
}
