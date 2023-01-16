import { BaseProvider, DelegateStat, GetDaoScore } from "./interfaces";
import { coalesce, getMultipliers } from "./multipliers/get-multipliers";

export class DefaultDaoScoreProvider
  extends BaseProvider
  implements GetDaoScore
{
  async preload(daoName: string) {
    const resource = await getMultipliers(daoName);
    this.multipliers = resource;
  }

  getForumScore(stat: Partial<DelegateStat>): number {
    const {
      forumScore: { lifetime = {} },
    } = this.multipliers;
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
    const {
      score: { lifetime = {} },
    } = this.multipliers;
    return (
      Math.round(
        stat.forumActivityScore * coalesce(lifetime.forumActivityScore, 1) +
          (stat.offChainVotesPct || 0) *
            coalesce(lifetime.offChainVotesPct, 1) +
          (stat.onChainVotesPct || 0) * coalesce(lifetime.onChainVotesPct, 1) +
          (stat.discordMessagesCount || 0) *
            coalesce(lifetime.discordMessagesCount, 1)
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
