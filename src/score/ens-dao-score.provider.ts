import { coalesce } from "../util/get-weights";
import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import {
  DelegateStat,
  DelegateStatPeriod,
  ScoreBreakdownCalc,
} from "./interfaces";

export class EnsDaoScoreProvider extends DefaultDaoScoreProvider {
  getForumScore(stat: Partial<DelegateStat>): number {
    const {
      forumScore: { lifetime = {} },
    } = this.weights;
    return (
      Math.round(
        stat.proposalsInitiated * coalesce(lifetime.proposalsInitiated, 1) +
          stat.proposalsDiscussed * coalesce(lifetime.proposalsDiscussed, 1) +
          stat.forumPostCount * coalesce(lifetime.forumPostCount, 1) +
          stat.forumTopicCount * coalesce(lifetime.forumTopicCount, 1) +
          stat.forumLikesReceived * coalesce(lifetime.forumLikesReceived, 1) +
          stat.forumPostsReadCount * coalesce(lifetime.forumPostsReadCount, 1)
      ) || 0
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    const {
      score: { lifetime = {} },
    } = this.weights;
    return (
      Math.round(
        stat.forumActivityScore ||
          0 * coalesce(lifetime.forumActivityScore, 1) +
            (stat.offChainVotesPct || 0) *
              coalesce(lifetime.offChainVotesPct, 1) +
            (stat.onChainVotesPct || 0) *
              coalesce(lifetime.onChainVotesPct, 1) +
            (stat.discordMessagesCount || 0) *
              coalesce(lifetime.discordMessagesCount, 1)
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
}
