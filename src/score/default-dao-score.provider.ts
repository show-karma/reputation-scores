import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
} from "./interfaces";
import { coalesce, getWeights } from "../util/get-weights";

export class DefaultDaoScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  async preload(daoName: string) {
    const resource = await getWeights(daoName);
    this.weights = resource;
  }

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
      "forumActivityScore",
      "offChainVotesPct",
      "onChainVotesPct",
      "discordMessagesCount",
    ];
  }

  getScoreBreakdownCalc(
    stat: Partial<DelegateStat>,
    period: DelegateStatPeriod = DelegateStatPeriod.lifetime
  ): ScoreBreakdownCalc {
    const {
      score: { lifetime = {} },
    } = this.weights;

    return [
      {
        label: "Forum activity score",
        value: coalesce(stat.forumActivityScore),
        weight: coalesce(lifetime.forumActivityScore, 1),
      },
      {
        label: "Off-chain votes pct",
        value: coalesce(stat.offChainVotesPct),
        weight: coalesce(lifetime.offChainVotesPct, 1),
        op: "+",
      },
      {
        label: "On-chain votes pct",
        value: coalesce(stat.onChainVotesPct),
        weight: coalesce(lifetime.onChainVotesPct, 1),
        op: "+",
      },
      {
        label: "Discord messages count",
        value: coalesce(stat.discordMessagesCount),
        weight: coalesce(lifetime.discordMessagesCount, 1),
        op: "+",
      },
    ];
  }
}
