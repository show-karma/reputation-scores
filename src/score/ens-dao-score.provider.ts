import { coalesce, getTotalWeight, getWeights } from "../util/get-weights";
import { DefaultDaoScoreProvider } from "./default-dao-score.provider";
import {
  BaseProvider,
  DelegateStat,
  DelegateStatPeriod,
  GetDaoScore,
  ScoreBreakdownCalc,
  ScoreMultiplier,
} from "./interfaces";

export class EnsDaoScoreProvider extends 
 BaseProvider
 implements GetDaoScore
 {

  weights: ScoreMultiplier;


  constructor(private readonly resourceName?: string) {
    super(resourceName);
  }

  
  async preload(resourceName?: string): Promise<void> {
    this.weights = await getWeights(
      resourceName || this.resourceName || "ens"
    );
  }

  getForumScore(stat: Partial<DelegateStat>): number {
    const {
      forumScore: { lifetime = {} },
    } = this.weights;
    const totalWeight = getTotalWeight(lifetime);
    return Math.round(
      ((coalesce(stat.proposalsInitiated, 0) *
        coalesce(lifetime.proposalsInitiated, 1) +
        coalesce(stat.proposalsDiscussed, 0) *
          coalesce(lifetime.proposalsDiscussed, 1) +
        coalesce(stat.forumPostCount, 0) *
          coalesce(lifetime.forumPostCount, 1) +
        coalesce(stat.forumTopicCount, 0) *
          coalesce(lifetime.forumTopicCount, 1) +
        coalesce(stat.forumLikesReceived, 0) *
          coalesce(lifetime.forumLikesReceived, 1) +
        coalesce(stat.forumPostsReadCount, 0) *
          coalesce(lifetime.forumPostsReadCount, 1)) /
        totalWeight) *
        100
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    const {
      score: { lifetime = {} },
    } = this.weights;
    const totalWeight = getTotalWeight(lifetime);
    return Math.round(
      ((coalesce(stat.forumActivityScore, 0) *
        coalesce(lifetime.forumActivityScore, 1) +
        coalesce(stat.offChainVotesPct, 0) *
          coalesce(lifetime.offChainVotesPct, 1) +
        coalesce(stat.onChainVotesPct, 0) *
          coalesce(lifetime.onChainVotesPct, 1) +
        coalesce(stat.discordMessagesCount, 0) *
          coalesce(lifetime.discordMessagesCount, 1)) /
        totalWeight) *
        100
    );
  }

  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[] {
    return [
      "forumActivityScore",
      "offChainVotesPct",
      "onChainVotesPct",
      "discordMessagesCount",
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
              label: "Proposals Initiated",
              value: coalesce(stat.proposalsInitiated),
              weight: coalesce(forum.proposalsInitiated, 1),
              op: "*",
            },
            {
              label: "Proposals Discussed",
              value: coalesce(stat.proposalsDiscussed),
              weight: coalesce(forum.proposalsDiscussed, 1),
              op: "+",
            },
            {
              label: "Forum Post Count",
              value: coalesce(stat.forumPostCount),
              weight: coalesce(forum.forumPostCount, 1),
              op: "+",
            },
            {
              label: "Forum Topic Count ",
              value: coalesce(stat.forumTopicCount),
              weight: coalesce(forum.forumTopicCount, 1),
              op: "+",
            },
            {
              label: "Forum Likes Received",
              value: coalesce(stat.forumLikesReceived),
              weight: coalesce(forum.forumLikesReceived, 1),
              op: "+",
            },
            {
              label: "Forum Posts Read Count",
              value: coalesce(stat.forumPostsReadCount),
              weight: coalesce(forum.forumPostsReadCount, 1),
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
          },
          {
            label: "Discord Messages %",
            value: coalesce(stat.discordMessagesCount),
            weight: coalesce(score.discordMessagesCount, 1),
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
