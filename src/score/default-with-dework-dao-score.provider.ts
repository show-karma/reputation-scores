import { BaseProvider, DelegateStat, DelegateStatPeriod, GetDaoScore, ScoreBreakdownCalc, ScoreMultiplier } from "./interfaces";

export class DefaultWithDeworkDaoScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  weights: ScoreMultiplier;
  getScoreBreakdownCalc(stat: Partial<DelegateStat>, period?: DelegateStatPeriod): ScoreBreakdownCalc {
    throw new Error("Method not implemented.");
  }
  preload(daoName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getForumScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        (stat.proposalsInitiated || 0) * 1 +
          (stat.proposalsDiscussed || 0) * 0.2 +
          (stat.forumPostCount || 0) * 0.1 +
          (stat.forumTopicCount || 0) * 0.3 +
          (stat.forumLikesReceived || 0) * 0.05 +
          (stat.forumPostsReadCount || 0) * 0.01
      ) || 0
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    return (
      Math.round(
        (stat.forumActivityScore || 0) +
          (stat.offChainVotesPct || 0) * 3 +
          (stat.onChainVotesPct || 0) * 5 +
          (stat.discordMessagesCount || 0) * 0.01 +
          (stat.deworkPoints || 0) * 0.1
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "forumActivityScore",
      "offChainVotesPct",
      "onChainVotesPct",
      "discordMessagesCount",
      "deworkPoints",
    ];
  }
}
