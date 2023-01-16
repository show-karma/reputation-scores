import { BaseProvider, DelegateStat, GetDaoScore } from "./interfaces";
import { multipliers } from "./multipliers/default";
export class DefaultDaoScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  getForumScore(stat: Partial<DelegateStat>): number {
    const {
      forumScore: { lifetime },
    } = multipliers;
    return (
      Math.round(
        stat.proposalsInitiated * lifetime.proposalsInitiated +
          stat.proposalsDiscussed * lifetime.proposalsDiscussed +
          stat.forumPostCount * lifetime.forumPostCount +
          stat.forumTopicCount * lifetime.forumTopicCount +
          stat.forumLikesReceived * lifetime.forumLikesReceived +
          stat.forumPostsReadCount * lifetime.forumPostsReadCount
      ) || 0
    );
  }

  getKarmaScore(stat: Partial<DelegateStat>, median: number): number {
    const {
      score: { lifetime },
    } = multipliers;
    return (
      Math.round(
        stat.forumActivityScore * lifetime.forumActivityScore +
          (stat.offChainVotesPct || 0) * lifetime.offChainVotesPct +
          (stat.onChainVotesPct || 0) * lifetime.onChainVotesPct +
          (stat.discordMessagesCount || 0) * lifetime.discordMessagesCount
      ) || 0
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
}
