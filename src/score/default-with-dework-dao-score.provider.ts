import { coalesce, getWeights } from "../util/get-weights";
import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
  ScoreMultiplier,
} from "./interfaces";

export class DefaultWithDeworkDaoScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  weights: ScoreMultiplier;

  async preload(resourceName?: string) {
    const resource = await getWeights(resourceName || "default-with-dework");
    this.weights = resource;
  }

  // Used for score breakdown display
  getScoreBreakdownCalc(
    stat: Partial<DelegateStat>,
    period?: DelegateStatPeriod,
    type: "forum" | "score" = "score"
  ): ScoreBreakdownCalc {
    const {
      score: { lifetime: karma },
      forumScore: { lifetime: forum },
    } = this.weights;
    switch (type) {
      case "forum": {
        return [
          {
            label: "Proposals Initiated",
            value: coalesce(stat.proposalsDiscussed, 0),
            weight: coalesce(forum.proposalsDiscussed, 1),
          },
          {
            label: "Proposals Discussed",
            op: "+",
            value: coalesce(stat.proposalsDiscussed, 0),
            weight: coalesce(forum.proposalsDiscussed, 1),
          },
          {
            label: "Forum Post Count",
            op: "+",
            value: coalesce(stat.forumPostCount, 0),
            weight: coalesce(forum.forumPostCount, 1),
          },
          {
            label: "Forum Topic Count",
            op: "+",
            value: coalesce(stat.forumTopicCount, 0),
            weight: coalesce(forum.forumTopicCount, 1),
          },
          {
            label: "Forum Likes Received",
            op: "+",
            value: coalesce(stat.forumLikesReceived, 0),
            weight: coalesce(forum.forumLikesReceived, 1),
          },
          {
            label: "Forum Posts Read Count",
            op: "+",
            value: coalesce(stat.forumPostsReadCount, 0),
            weight: coalesce(forum.forumPostsReadCount, 1),
          },
        ];
      }
      case "score": {
        return [
          {
            label: "Forum Activity Score",
            value: coalesce(stat.forumActivityScore, 0),
            weight: coalesce(karma.forumActivityScore, 1),
          },
          {
            label: "Off-chain Votes %",
            value: coalesce(stat.offChainVotesPct, 0),
            weight: coalesce(karma.offChainVotesPct, 1),
            op: "+",
          },
          {
            label: "On-chain Votes %",
            value: coalesce(stat.onChainVotesPct, 0),
            weight: coalesce(karma.onChainVotesPct, 1),
            op: "+",
          },
          {
            label: "Discord Message Percentile",
            value: coalesce(stat.discordMessagePercentile, 0),
            weight: coalesce(karma.discordMessagePercentile, 1),
            op: "+",
          },
          {
            label: "Dework Points",
            value: coalesce(stat.deworkPoints, 0),
            weight: coalesce(karma.deworkPoints, 1),
            op: "+",
          },
        ];
      }
    }
  }

  getForumScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        (stat.proposalsInitiated || 0) * 1 +
          (stat.proposalsDiscussed || 0) * 0.2 +
          (stat.forumPostCount || 0) * 0.1 +
          (stat.forumTopicCount || 0) * 0.3 +
          (stat.forumLikesReceived || 0) * 0.05 +
          (stat.forumPostsReadCount || 0) * 0.01
      ) || 0
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    return (
      Math.round(
        (stat.forumActivityScore || 0) +
          (stat.offChainVotesPct || 0) * 3 +
          (stat.onChainVotesPct || 0) * 5 +
          (stat.discordMessagesCount || 0) * 0.01 +
          (stat.deworkPoints || 0) * 0.1
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "forumActivityScore",
      "offChainVotesPct",
      "onChainVotesPct",
      "discordMessagesCount",
      "deworkPoints",
    ];
  }
}
