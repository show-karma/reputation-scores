import { coalesce, getTotalWeight, getWeights } from "../util/get-weights";
import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
  ScoreMultiplier,
} from "./interfaces";

export class SSVStagNetworkPercentileScoreProvider
  extends BaseProvider
  implements GetDaoScore {
  weights: ScoreMultiplier;

  constructor(private readonly resourceName?: string) {
    super(resourceName);
  }

  async preload(resourceName?: string): Promise<void> {
    this.weights = await getWeights(
      resourceName || this.resourceName || "ssvnetwork_custom"
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
          coalesce(stat.forumPostsReadCountPercentile) *
          coalesce(lifetime?.forumPostsReadCountPercentile, 1)) /
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
      ((coalesce(stat.forumActivityScore) *
        coalesce(lifetime?.forumActivityScore, 1) +
        coalesce(stat.offChainVotesPct) *
        coalesce(lifetime?.offChainVotesPct, 1) +
        coalesce(stat.discordMessagePercentile) *
        coalesce(lifetime?.discordMessagePercentile, 1)) /
        totalWeight) *
      100
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "forumActivityScore",
      "offChainVotesPct",
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
              weight: coalesce(forum?.proposalsInitiatedPercentile, 1),
              op: "*",
            },
            {
              label: "Proposals Discussed Percentile",
              value: coalesce(stat.proposalsDiscussedPercentile),
              weight: coalesce(forum?.proposalsDiscussedPercentile, 1),
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
              label: "Forum Posts Read Count Percentile",
              value: coalesce(stat.forumPostsReadCountPercentile),
              weight: coalesce(forum?.forumPostsReadCountPercentile, 1),
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
            label: "Discord Messages %",
            value: coalesce(stat.discordMessagePercentile),
            weight: coalesce(score.discordMessagePercentile, 1),
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
