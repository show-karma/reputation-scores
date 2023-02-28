
import { coalesce, getTotalWeight, getWeights } from "../util/get-weights";
import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
  ScoreMultiplier,
} from "./interfaces";

export class GivethPercentileScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  weights: ScoreMultiplier;

  constructor(private readonly resourceName?: string) {
    super(resourceName);
  }

  async preload(resourceName?: string): Promise<void> {
    this.weights = await getWeights(
      resourceName || this.resourceName || "apecoin"
    );
  }

  getForumScore(stat: Partial<DelegateStat>): number {
    const {
      forumScore: { lifetime },
    } = this.weights;
    const totalWeight = getTotalWeight(lifetime);
    return (
      Math.round(
        ((coalesce(stat.proposalsInitiatedPercentile) *
          coalesce(lifetime?.proposalsInitiatedPercentile, 1) +
          coalesce(stat.proposalsDiscussedPercentile) *
            coalesce(lifetime?.proposalsDiscussedPercentile, 1) +
          coalesce(stat.forumPostCountPercentile) *
            coalesce(lifetime?.forumPostCountPercentile, 1) +
          coalesce(stat.forumTopicCountPercentile) *
            coalesce(lifetime?.forumTopicCountPercentile, 1) +
          coalesce(stat.forumLikesReceivedPercentile) *
            coalesce(lifetime?.forumLikesReceivedPercentile, 1) +
          coalesce(stat.avgPostLength) *
            coalesce(lifetime?.avgPostLength, 1)) /
          totalWeight) *
          100
      ) || 0
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    const {
      score: { lifetime },
    } = this.weights;
    const totalWeight = getTotalWeight(lifetime);

    return Math.round(
      ((coalesce(stat.offChainVotesPct) *
        coalesce(lifetime?.offChainVotesPct, 1) +
        coalesce(stat.onChainVotesPct) *
          coalesce(lifetime?.onChainVotesPct, 1) +
        coalesce(stat.onChainVotesPct)+
        coalesce(stat.forumActivityScore) *
        coalesce(lifetime?.forumActivityScore, 1)) /
        totalWeight) *
        100
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "offChainVotesPct",
      "offChainVotesPct",
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
          label: "Max Score Setting",
          value: 100,
          weight: 1,
          childrenOp: "*",
          children: [
            {
              label: "Proposals Initiated Percentile",
              value: coalesce(stat.proposalsDiscussedPercentile),
              weight: coalesce(forum?.proposalsDiscussedPercentile, 1),
              op: "*",
            },
            {
              label: "Proposals Discussed Percentile",
              value: coalesce(stat.proposalsInitiatedPercentile),
              weight: coalesce(forum?.proposalsInitiatedPercentile, 1),
              op: "+",
            },
            {
              label: "Forum Post Count Percentile",
              value: coalesce(stat.forumPostCountPercentile),
              weight: coalesce(forum?.forumPostCountPercentile, 1),
              op: "+",
            },
            {
              label: "Forum Topic Count Percentile",
              value: coalesce(stat.forumTopicCountPercentile),
              weight: coalesce(forum?.forumTopicCountPercentile, 1),
              op: "+",
            },
            {
              label: "Forum Likes Received Percentile",
              value: coalesce(stat.forumLikesReceivedPercentile),
              weight: coalesce(forum?.forumLikesReceivedPercentile, 1),
              op: "+",
            },
            {
              label: "Forum Average Post Length",
              value: coalesce(stat.avgPostLength),
              weight: coalesce(forum?.avgPostLength, 1),
              op: "+",
            },
          ],
        },
        {
          label: "Sum of Weights times Max Score Setting",
          value: getTotalWeight(forum),
          weight: 1,
          op: "/",
        },
      ];

    return [
      {
        label: "Max Score Setting",
        value: 100,
        weight: 1,
        childrenOp: "*",
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
          }
        ],
      },
      {
        label: "Sum of Weights times Max Score Setting",
        value: getTotalWeight(score),
        weight: 1,
        op: "/",
      },
    ];
  }
}
