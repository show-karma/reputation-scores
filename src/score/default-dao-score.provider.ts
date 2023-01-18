import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
  ScoreMultiplier,
} from "./interfaces";
import { coalesce, getWeights } from "../util/get-weights";

export class DefaultDaoScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  weights: ScoreMultiplier;

  async preload(resourceName: string) {
    const resource = await getWeights(resourceName);
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
    period: DelegateStatPeriod = DelegateStatPeriod.lifetime,
    type: "forum" | "score" = "score"
  ): ScoreBreakdownCalc {
    const {
      score: { lifetime: score = {} },
      forumScore: { lifetime: forum = {} },
    } = this.weights;

    if (type === "forum")
      return [
        {
          label: "Forum Topic Count",
          value: coalesce(stat.proposalsInitiated),
          weight: coalesce(forum.proposalsInitiated),
          op: "+",
        },
        {
          label: "Proposals Discussed",
          value: coalesce(stat.proposalsDiscussed),
          weight: coalesce(forum.proposalsDiscussed),
          op: "+",
        },
        {
          label: "Forum Post Count",
          value: coalesce(stat.forumPostCount),
          weight: coalesce(forum.forumPostCount),
          op: "+",
        },
        {
          label: "Forum Topic Count",
          value: coalesce(stat.forumTopicCount),
          weight: coalesce(forum.forumTopicCount),
          op: "+",
        },
        {
          label: "Forum Likes Received",
          value: coalesce(stat.forumLikesReceived),
          weight: coalesce(forum.forumLikesReceived),
          op: "+",
        },
        {
          label: "Forum Posts Read Count",
          value: coalesce(stat.forumPostsReadCount),
          weight: coalesce(forum.forumPostsReadCount),
          op: "+",
        },
      ];

    return [
      {
        label: "Forum Activity Score",
        value: coalesce(stat.forumActivityScore),
        weight: coalesce(score.forumActivityScore, 1),
      },
      {
        label: "Off-Chain Votes Pct",
        value: coalesce(stat.offChainVotesPct),
        weight: coalesce(score.offChainVotesPct, 1),
        op: "+",
      },
      {
        label: "On-Chain Votes Pct",
        value: coalesce(stat.onChainVotesPct),
        weight: coalesce(score.onChainVotesPct, 1),
      },
      {
        label: "Discord Messages Count",
        value: coalesce(stat.discordMessagesCount),
        weight: coalesce(score.discordMessagesCount, 1),
        op: "+",
      },
    ];
  }
}
