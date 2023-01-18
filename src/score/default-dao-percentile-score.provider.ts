import { coalesce, getTotalWeight, getWeights } from "../util/get-weights";
import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
  ScoreMultiplier,
} from "./interfaces";

export class DefaultDaoPercentileScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  weights: ScoreMultiplier;

  async preload(): Promise<void> {
    this.weights = await getWeights("default-percentile");
  }

  // max here 100 + 20 + 10 + 30 + 5 + 1 = 166
  getForumScore(stat: Partial<DelegateStat>): number {
    const {
      forumScore: { lifetime },
    } = this.weights;
    const totalWeight =
      100 *
      Object.keys(lifetime).reduce(
        (acc, cur) => (acc += coalesce(lifetime[cur], 1)),
        0
      );
    return (
      Math.round(
        ((stat.proposalsInitiatedPercentile *
          coalesce(lifetime.proposalsInitiatedPercentile, 1) +
          stat.proposalsDiscussedPercentile *
            coalesce(lifetime.proposalsDiscussedPercentile, 1) +
          stat.forumPostCountPercentile *
            coalesce(lifetime.forumPostCountPercentile, 1) +
          stat.forumTopicCountPercentile *
            coalesce(lifetime.forumTopicCountPercentile, 1) +
          stat.forumLikesReceivedPercentile *
            coalesce(lifetime.forumLikesReceivedPercentile, 1) +
          stat.forumPostsReadCountPercentile *
            coalesce(lifetime.forumPostsReadCountPercentile, 1)) /
          totalWeight) *
          100
      ) || 0
    );
  }

  // max here 100 + 300 + 500 + 1 = 901
  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    const {
      score: { lifetime },
    } = this.weights;
    const totalWeight = getTotalWeight(lifetime);

    return (
      Math.round(
        ((stat.forumActivityScore * coalesce(lifetime.forumActivityScore) +
          (stat.offChainVotesPct || 0) * coalesce(lifetime.offChainVotesPct) +
          (stat.onChainVotesPct || 0) * coalesce(lifetime.onChainVotesPct) +
          (stat.discordMessagePercentile || 0) *
            coalesce(lifetime.discordMessagePercentile)) /
          totalWeight) *
          100
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "forumActivityScore",
      "offChainVotesPct",
      "onChainVotesPct",
      "discordMessagePercentile",
    ];
  }

  getScoreBreakdownCalc(
    stat: Partial<DelegateStat>,
    period?: DelegateStatPeriod,
    type: "forum" | "score" = "score"
  ): ScoreBreakdownCalc {
    const {
      score: { lifetime: score },
      forumScore: { lifetime: forum },
    } = this.weights;

    if (type == "forum")
      return [
        {
          label: "Percent Multiplier",
          value: 100,
          weight: 1,
          children: [
            {
              label: "Proposals Initiated Percentile",
              value: coalesce(stat.proposalsDiscussedPercentile),
              weight: coalesce(forum.proposalsDiscussedPercentile, 1),
              op: "*",
            },
            {
              label: "Proposals Discussed Percentile",
              value: coalesce(stat.proposalsInitiatedPercentile),
              weight: coalesce(forum.proposalsInitiatedPercentile, 1),
              op: "+",
            },
            {
              label: "Forum Post Count Percentile",
              value: coalesce(stat.forumPostCountPercentile),
              weight: coalesce(forum.forumPostCountPercentile, 1),
              op: "+",
            },
            {
              label: "Forum Topic Count Percentile",
              value: coalesce(stat.forumTopicCountPercentile),
              weight: coalesce(forum.forumTopicCountPercentile, 1),
              op: "+",
            },
            {
              label: "Forum Likes Received Percentile",
              value: coalesce(stat.forumLikesReceivedPercentile),
              weight: coalesce(forum.forumLikesReceivedPercentile, 1),
              op: "+",
            },
            {
              label: "Forum Posts Read Count Percentile",
              value: coalesce(stat.forumPostsReadCountPercentile),
              weight: coalesce(forum.forumPostsReadCountPercentile, 1),
              op: "+",
            },
          ],
        },
        {
          label: "Total Weights",
          value: getTotalWeight(forum),
          weight: 1,
          op: "/",
        },
      ];

    return [
      {
        label: "Percent Multiplier",
        value: 100,
        weight: 1,
        children: [
          {
            label: "Forum Activity Score",
            value: coalesce(stat.forumActivityScore),
            weight: coalesce(score.forumActivityScore, 1),
            op: "*",
          },
          {
            label: "Off-chain Votes %",
            value: coalesce(stat.offChainVotesPct),
            weight: coalesce(score.offChainVotesPct, 1),
            op: "+",
          },
          {
            label: "On-chain Votes %",
            value: coalesce(stat.onChainVotesPct),
            weight: coalesce(score.onChainVotesPct, 1),
            op: "+",
          },
          {
            label: "Discord Messages %",
            value: coalesce(stat.discordMessagePercentile),
            weight: coalesce(score.discordMessagePercentile, 1),
            op: "+",
          },
        ],
      },
      {
        label: "Total Weights",
        value: getTotalWeight(score),
        weight: 1,
        op: "/",
      },
    ];
  }
}
