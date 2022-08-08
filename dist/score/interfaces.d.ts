export interface DaoProviderDescriptor {
    cls: string;
    args: unknown[];
}
export declare enum DelegateStatPeriod {
    lifetime = "lifetime",
    "30d" = "30d"
}
export interface DelegateStat {
    id: number;
    delegateId: number;
    period: DelegateStatPeriod;
    daoName: string;
    karmaScore: number;
    karmaRank: number;
    forumActivityScore: number;
    forumLikesReceived: number;
    forumPostsReadCount: number;
    proposalsInitiated: number;
    proposalsDiscussed: number;
    forumTopicCount: number;
    forumPostCount: number;
    delegatedVotes: number;
    offChainVotesPct: number;
    onChainVotesPct: number;
    percentile: number;
    createdAt: Date;
    updatedAt: Date;
    discordMessagesCount: number;
}
export declare class BaseProvider {
    private readonly args;
    constructor(...args: unknown[]);
    toProviderDescriptor(): DaoProviderDescriptor;
}
export interface GetDaoScore {
    getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
    getForumScore(stat: Partial<DelegateStat>): number;
    getKarmaScoreProps(): (keyof Partial<DelegateStat> | 'median')[];
}
export interface AdditionalScoreProvider {
    preload(): Promise<void>;
    isPublicAddressEligible(publicAddress: string): Promise<boolean>;
    getScore(publicAddress: string, stat: Partial<DelegateStat>): Promise<number>;
}
