import { coalesce, getTotalWeight, getWeights } from "../util/get-weights";
import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
  ScoreMultiplier,
} from "./interfaces";

export class MoonbeamPercentileScoreProvider
  extends BaseProvider
  implements GetDaoScore {
  weights: ScoreMultiplier;

  constructor(private readonly resourceName?: string) {
    super(resourceName);
  }

  async preload(resourceName?: string): Promise<void> {
    this.weights = await getWeights(
      resourceName || this.resourceName || "default-percentile"
    );
  }

  // max here 100 + 20 + 10 + 30 + 5 + 1 = 166
  getForumScore(stat: Partial<DelegateStat>): number {
    const {
      forumScore: { lifetime },
    } = this.weights;
    const totalWeight = getTotalWeight(lifetime);
    return (
      Math.round(
        ((coalesce(stat.proposalsInitiatedPercentile, 0) *
          coalesce(lifetime.proposalsInitiatedPercentile, 1) +
          coalesce(stat.proposalsDiscussedPercentile, 0) *
          coalesce(lifetime.proposalsDiscussedPercentile, 1) +
          coalesce(stat.forumPostCountPercentile, 0) *
          coalesce(lifetime.forumPostCountPercentile, 1) +
          coalesce(stat.forumTopicCountPercentile, 0) *
          coalesce(lifetime.forumTopicCountPercentile, 1) +
          coalesce(stat.forumLikesReceivedPercentile, 0) *
          coalesce(lifetime.forumLikesReceivedPercentile, 1) +
          coalesce(stat.forumPostsReadCountPercentile, 0) *
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
        ((coalesce(stat.forumActivityScore, 1) * coalesce(lifetime.forumActivityScore) +
          (stat.onChainVotesPct || 0) * coalesce(lifetime.onChainVotesPct)) /
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
          label: "Max Score Setting",
          value: 100,
          weight: 1,
          childrenOp: "*",
          children: [
            {
              label: "Proposals Initiated Percentile",
              value: coalesce(stat.proposalsInitiatedPercentile),
              weight: coalesce(forum.proposalsInitiatedPercentile, 1),
              op: "*",
            },
            {
              label: "Proposals Discussed Percentile",
              value: coalesce(stat.proposalsDiscussedPercentile),
              weight: coalesce(forum.proposalsDiscussedPercentile, 1),
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
            label: "On-chain Votes %",
            value: coalesce(stat.onChainVotesPct),
            weight: coalesce(score.onChainVotesPct, 1),
            op: "+",
          },
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
