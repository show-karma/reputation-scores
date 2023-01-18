import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import {
  DelegateStat,
  DelegateStatPeriod,
  ScoreBreakdownCalc,
} from "./interfaces";

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
          stat.delegatedVotes / 1000 +
          (stat.discordMessagesCount || 0) * 0.01
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "offChainVotesPct",
      "onChainVotesPct",
      "delegatedVotes",
      "discordMessagesCount",
    ];
  }

  getScoreBreakdownCalc(
    stat: Partial<DelegateStat>,
    period?: DelegateStatPeriod,
    type?: "forum" | "score"
  ): ScoreBreakdownCalc {
    if (type === "forum") return [];

    return [];
  }
}
