import { coalesce } from "../util/get-weights";
import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
  ScoreMultiplier,
} from "./interfaces";

export class IdleDaoScoreProvider extends BaseProvider implements GetDaoScore {
  weights: ScoreMultiplier;

  preload(daoName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getForumScore(stat: Partial<DelegateStat>): number {
    return (
      Math.round(
        (stat.proposalsInitiated || 0) * 10 +
          (stat.proposalsDiscussed || 0) * 2 +
          (stat.forumPostCount || 0) +
          (stat.forumTopicCount || 0) * 3 +
          (stat.forumLikesReceived || 0) * 0.5 +
          (stat.forumPostsReadCount || 0) * 0.1
      ) || 0
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    return (
      Math.round(
        stat.delegatedVotes * 0.1 +
          (stat.forumActivityScore || 0) +
          (stat.offChainVotesPct || 0) * 3 +
          (stat.onChainVotesPct || 0) * 5 +
          (stat.discordMessagesCount || 0) * 0.01
      ) || 0
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "delegatedVotes",
      "forumActivityScore",
      "offChainVotesPct",
      "onChainVotesPct",
      "discordMessagesCount",
    ];
  }

  getScoreBreakdownCalc(
    stat: Partial<DelegateStat>,
    period: DelegateStatPeriod = DelegateStatPeriod.lifetime,
    type: "forum" | "score" = "score"
  ): ScoreBreakdownCalc {
    const {
      score: { lifetime: score = {} },
      forumScore: { lifetime: forum = {} },
    } = this.weights;

    if (type === "forum")
      return [
        {
          label: "Forum Topic Count",
          value: coalesce(stat.proposalsInitiated),
          weight: coalesce(forum.proposalsInitiated),
          op: "+",
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
        weight: coalesce(score.delegatedVotes, 1),
      },
      {
        label: "Forum Activity Score",
        value: coalesce(stat.forumActivityScore),
        weight: coalesce(score.forumActivityScore, 1),
      },
      {
        label: "Off-Chain Votes Pct",
        value: coalesce(stat.offChainVotesPct),
        weight: coalesce(score.offChainVotesPct, 1),
        op: "+",
      },
      {
        label: "On-Chain Votes Pct",
        value: coalesce(stat.onChainVotesPct),
        weight: coalesce(score.onChainVotesPct, 1),
      },
      {
        label: "Discord Messages Count",
        value: coalesce(stat.discordMessagesCount),
        weight: coalesce(score.discordMessagesCount, 1),
        op: "+",
      },
    ];
  }
}
