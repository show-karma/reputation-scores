import { coalesce, getTotalWeight } from "../util/get-weights";
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
    const totalWeight = getTotalWeight(lifetime);
    return Math.round(
      ((coalesce(stat.proposalsInitiatedPercentile, 0) *
        coalesce(lifetime.proposalsInitiated, 1) +
        coalesce(stat.proposalsDiscussed, 0) *
          coalesce(lifetime.proposalsDiscussed, 1) +
        coalesce(stat.forumPostCount, 0) *
          coalesce(lifetime.forumPostCount, 1) +
        coalesce(stat.forumTopicCount, 0) *
          coalesce(lifetime.forumTopicCount, 1) +
        coalesce(stat.forumLikesReceived, 0) *
          coalesce(lifetime.forumLikesReceived, 1) +
        coalesce(stat.forumPostsReadCount, 0) *
          coalesce(lifetime.forumPostsReadCount, 1)) /
        totalWeight) *
        100
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    const {
      score: { lifetime = {} },
    } = this.weights;
    const totalWeight = getTotalWeight(lifetime);
    return Math.round(
      ((coalesce(stat.forumActivityScore, 0) *
        coalesce(lifetime.forumActivityScore, 1) +
        coalesce(stat.offChainVotesPct, 0) *
          coalesce(lifetime.offChainVotesPct, 1) +
        coalesce(stat.onChainVotesPct, 0) *
          coalesce(lifetime.onChainVotesPct, 1) +
        coalesce(stat.discordMessagesCount, 0) *
          coalesce(lifetime.discordMessagesCount, 1)) /
        totalWeight) *
        100
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
