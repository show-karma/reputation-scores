import { coalesce } from "../util/get-weights";
import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import {
  DelegateStat,
  DelegateStatPeriod,
  ScoreBreakdownCalc,
} from "./interfaces";

export class GitcoinDaoPercentileScoreProvider extends DefaultDaoScoreProvider {
  // 200 is max karma score
  getKarmaScore(stat: Partial<DelegateStat>): number {
    return Math.round(
      ((stat.forumActivityScore + (stat.offChainVotesPct || 0) || 0) / 200) *
        100
    );
  }

  // 1660 sum of all forum props percentiles
  getForumScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        (((stat.proposalsInitiatedPercentile || 0) * 10 +
          (stat.proposalsDiscussedPercentile || 0) * 2 +
          (stat.forumPostCountPercentile || 0) +
          (stat.forumTopicCountPercentile || 0) * 3 +
          (stat.forumLikesReceivedPercentile || 0) * 0.5 +
          (stat.forumPostsReadCountPercentile || 0) * 0.1) *
          100) /
          1660
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
        ],
      },
      {
        label: "Total Weights",
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
