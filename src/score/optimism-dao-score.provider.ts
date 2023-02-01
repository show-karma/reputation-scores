import { coalesce, getWeights } from "../util/get-weights";
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
    return Math.round(stat.delegatedVotes / 10000 + stat.offChainVotesPct * 2);
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
      ];

    return [
      {
        label: "Delegated Votes",
        value: coalesce(stat.delegatedVotes),
        weight: coalesce(lifetime.delegatedVotes),
      },
      {
        label: "Off chain votes %",
        value: coalesce(stat.offChainVotesPct),
        weight: coalesce(lifetime.offChainVotesPct),
        op: "+",
      },
    ];
  }
}
