import { coalesce, getTotalWeight, getWeights } from "../util/get-weights";
import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import {
  DelegateStat,
  DelegateStatPeriod,
  ScoreBreakdownCalc,
} from "./interfaces";

export class GitcoinDaoPercentileScoreProvider extends DefaultDaoScoreProvider {
  async preload(_: string) {
    const resource = await getWeights("gitcoin-percentile");
    this.weights = resource;
  }

  // 200 is max karma score
  getKarmaScore(stat: Partial<DelegateStat>): number {
    const {
      score: { lifetime },
    } = this.weights;

    const totalWeight = getTotalWeight(lifetime);
    return Math.round(
      ((stat.forumActivityScore * coalesce(lifetime.forumActivityScore) +
        (stat.offChainVotesPct || 0) * coalesce(lifetime.offChainVotesPct) ||
        0) /
        totalWeight) *
        100
    );
  }

  // 1660 sum of all forum props percentiles
  getForumScore(stat: Partial<DelegateStat>): number {
    const {
      forumScore: { lifetime },
    } = this.weights;

    const totalWeight = getTotalWeight(lifetime);

    return (
      Math.round(
        (((stat.proposalsInitiatedPercentile || 0) *
          coalesce(lifetime.proposalsInitiatedPercentile) +
          (stat.proposalsDiscussedPercentile || 0) *
            coalesce(lifetime.proposalsDiscussedPercentile) +
          (stat.forumPostCountPercentile || 0) *
            coalesce(lifetime.forumPostCountPercentile) +
          (stat.forumTopicCountPercentile || 0) *
            coalesce(lifetime.forumTopicCountPercentile) +
          (stat.forumLikesReceivedPercentile || 0) *
            coalesce(lifetime.forumLikesReceivedPercentile) +
          (stat.forumPostsReadCountPercentile || 0) *
            coalesce(lifetime.forumPostsReadCountPercentile)) *
          100) /
          totalWeight
      ) || 0
    );
  }

  getScoreBreakdownCalc(
    stat: Partial<DelegateStat>,
    period?: DelegateStatPeriod,
    type: "forum" | "score" = "score"
  ): ScoreBreakdownCalc {
    const {
      score: { lifetime: score = {} },
      forumScore: { lifetime: forum = {} },
    } = this.weights;

    // (100 * (children)) / 1660
    if (type == "forum")
      return [
        {
          label: "Max Score Setting",
          value: 100,
          weight: 1,
          childrenOp: "*",
          children: [
            {
              label: "Proposals Discussed Percentile",
              value: coalesce(stat.proposalsDiscussedPercentile),
              weight: coalesce(forum.proposalsDiscussedPercentile, 1),
            },
            {
              label: "Proposals Initiated Percentile",
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
          label: "Sum of Weights times Max Score Setting",
          // sum all weights * 100 to get total pct divisor
          value:
            (coalesce(forum.proposalsDiscussedPercentile, 1) +
              coalesce(forum.proposalsInitiatedPercentile, 1) +
              coalesce(forum.forumPostCountPercentile, 1) +
              coalesce(forum.forumTopicCountPercentile, 1) +
              coalesce(forum.forumLikesReceivedPercentile, 1) +
              coalesce(forum.forumPostsReadCountPercentile, 1)) *
            100,
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
          },
          {
            label: "Off-chain Votes %",
            value: coalesce(stat.offChainVotesPct),
            weight: coalesce(score.offChainVotesPct, 1),
            op: "+",
          },
        ],
      },
      {
        label: "Sum of Weights times Max Score Setting",
        value:
          (coalesce(score.forumActivityScore, 1) +
            coalesce(score.offChainVotesPct, 1)) *
          100,
        weight: 1,
        op: "/",
      },
    ];
  }
}
