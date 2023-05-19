import { coalesce, getTotalWeight, getWeights } from "../util/get-weights";
import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
  ScoreMultiplier,
} from "./interfaces";

export class OptimismDaoScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  weights: ScoreMultiplier;

  async preload(resourceName = "optimism"): Promise<void> {
    this.weights = await getWeights(resourceName);
  }

  getForumScore(stat: Partial<DelegateStat>): number {
    const {
      forumScore: { lifetime = {} },
    } = this.weights;
    const totalWeight = getTotalWeight(lifetime);
    return Math.round(
      ((coalesce(stat.proposalsInitiatedPercentile, 0) *
        coalesce(lifetime.proposalsInitiated, 1) +
        coalesce(stat.proposalsDiscussedPercentile, 0) *
          coalesce(lifetime.proposalsDiscussed, 1) +
        coalesce(stat.forumPostCountPercentile, 0) *
          coalesce(lifetime.forumPostCount, 1) +
        coalesce(stat.forumTopicCountPercentile, 0) *
          coalesce(lifetime.forumTopicCount, 1) +
        coalesce(stat.forumLikesReceivedPercentile, 0) *
          coalesce(lifetime.forumLikesReceived, 1) +
        coalesce(stat.forumPostsReadCountPercentile, 0) *
          coalesce(lifetime.forumPostsReadCount, 1)) /
        totalWeight) *
        100
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    const {
      score: { lifetime },
    } = this.weights;
    const totalWeight = getTotalWeight(lifetime);
    return Math.round(
      ((coalesce(stat.voteWeight, 0) * coalesce(lifetime.delegatedVotes, 1) +
        coalesce(stat.offChainVotesPct, 0) *
          coalesce(lifetime.offChainVotesPct, 1)) /
        totalWeight) *
        100
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return ["delegatedVotes", "offChainVotesPct"];
  }

  getScoreBreakdownCalc(
    stat: Partial<DelegateStat>,
    period?: DelegateStatPeriod,
    type: "forum" | "score" = "score"
  ): ScoreBreakdownCalc {
    const {
      score: { lifetime = {} },
      forumScore: { lifetime: forum = {} },
    } = this.weights;

    if (type === "forum")
      return [
        {
          label: "Max Score Setting",
          value: 100,
          weight: 1,
          childrenOp: "*",
          children: [
            {
              label: "Proposals Initiated",
              value: coalesce(stat.proposalsInitiated),
              weight: coalesce(forum.proposalsInitiated),
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
          ],
        },
        {
          label: "Total Weight",
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
            label: "Delegated Votes %",
            value: coalesce(stat.voteWeight),
            weight: coalesce(lifetime.delegatedVotes),
          },
          {
            label: "Off chain votes %",
            value: coalesce(stat.offChainVotesPct),
            weight: coalesce(lifetime.offChainVotesPct),
            op: "+",
          },
        ],
      },
      {
        label: "Total Weight",
        value: getTotalWeight(lifetime),
        weight: 1,
        op: "/",
      },
    ];
  }
}
