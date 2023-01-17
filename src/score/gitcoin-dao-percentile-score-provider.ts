import { coalesce } from "src/util/get-weights";
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
    period?: DelegateStatPeriod
  ): ScoreBreakdownCalc {
    // (100 * (children)) / 1660
    return [
      {
        label: "Percent Multiplier",
        value: 100,
        weight: 1,
        children: [
          {
            label: "Proposals Initiated Percentile",
            value: coalesce(stat.proposalsDiscussedPercentile),
            weight: 10,
            op: "*",
          },
          {
            label: "Proposals Discussed Percentile",
            value: coalesce(stat.proposalsInitiatedPercentile),
            weight: 2,
            op: "+",
          },
          {
            label: "Forum Post Count Percentile",
            value: coalesce(stat.forumPostCountPercentile),
            weight: 1,
            op: "+",
          },
          {
            label: "Forum Topic Count Percentile",
            value: coalesce(stat.forumTopicCountPercentile),
            weight: 3,
            op: "+",
          },
          {
            label: "Forum Likes Received Percentile",
            value: coalesce(stat.forumLikesReceivedPercentile),
            weight: 0.5,
            op: "+",
          },
          {
            label: "Forum Posts Read Count Percentile",
            value: coalesce(stat.forumPostsReadCountPercentile),
            weight: 0.1,
            op: "+",
          },
        ],
      },
      {
        label: "Total Divider",
        value: 1660,
        weight: 1,
        op: "/",
      },
    ];
  }
}
