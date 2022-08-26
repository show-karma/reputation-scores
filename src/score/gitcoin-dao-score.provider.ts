import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import { DelegateStat } from "./interfaces";

export class GitcoinDaoScoreProvider extends DefaultDaoScoreProvider {
  getKarmaScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(stat.forumActivityScore + (stat.offChainVotesPct || 0)) || 0
    );
  }

  getForumScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        stat.proposalsInitiated * 10 +
          stat.proposalsDiscussed * 2 +
          stat.forumPostCount +
          stat.forumTopicCount * 3 +
          stat.forumLikesReceived * 0.5 +
          stat.forumPostsReadCount * 0.1 +
          (stat.discordMessagesCount || 0) * 0.01
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return ["forumActivityScore", "offChainVotesPct", "discordMessagesCount"];
  }
}
