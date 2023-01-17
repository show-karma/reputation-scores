export interface DaoProviderDescriptor {
  cls: string;
  args: unknown[];
}

export enum DelegateStatPeriod {
  lifetime = "lifetime",
  "7d" = "7d",
  "30d" = "30d",
  "90d" = "90d",
  "180d" = "180d",
  "1y" = "1y",
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
  deworkPoints: number;
  discordMessagePercentile: number;
  proposalsInitiatedPercentile: number;
  proposalsDiscussedPercentile: number;
  forumPostCountPercentile: number;
  forumTopicCountPercentile: number;
  forumLikesReceivedPercentile: number;
  forumPostsReadCountPercentile: number;
}

export abstract class BaseProvider {
  private readonly args: unknown[];
  protected weights: ScoreMultiplier;

  constructor(...args: unknown[]) {
    this.args = args;
  }

  abstract preload(resourceName: string | "default"): Promise<void>;

  // abstract getScoreBreakdownCalc(): ScoreBreakdownCalc;

  toProviderDescriptor(): DaoProviderDescriptor {
    return {
      cls: this.constructor.name,
      args: this.args,
    };
  }
}

export interface GetDaoScore {
  getKarmaScore(stat: Partial<DelegateStat>, median: number): number;
  getForumScore(stat: Partial<DelegateStat>): number;
  getKarmaScoreProps(): (keyof Partial<DelegateStat> | "median")[];
}

export interface AdditionalScoreProvider {
  preload(): Promise<void>;
  isPublicAddressEligible(publicAddress: string): Promise<boolean>;
  getScore(publicAddress: string, stat: Partial<DelegateStat>): Promise<number>;
}

export interface MultiplierType {
  "7d": Record<string, number>;
  "180d": Record<string, number>;
  "90d": Record<string, number>;
  "30d": Record<string, number>;
  lifetime: Record<string, number>;
}
interface WorkstreamInvolvement {
  lead: number;
  contributor: number;
  none: number;
}
export interface ScoreMultiplier {
  score: MultiplierType;
  healthScore?: MultiplierType;
  forumScore?: MultiplierType;
  workstreamInvolvement?: WorkstreamInvolvement;
}

export type Operator = "+" | "-" | "/" | "*";

export interface ScoreBreakdownCalcItem {
  /**
   * The item name
   */
  label: string;
  /**
   * The value to be weighted
   */
  value: number;
  /**
   * The weight to multiply the value
   */
  weight: number;
  /**
   * The sub calculation, will be interpreted as
   *
   * > `Parent <Child[0].op> ( ChildrenResult )`
   */
  children?: ScoreBreakdownChildren;
  /**
   * Mathematical operator represented as string
   */
  op?: Operator;
}

export type ScoreBreakdownCalc = ScoreBreakdownCalcItem[];
type ScoreBreakdownChildren = (ScoreBreakdownCalcItem & {
  /**
   * The operator type. The first item in the children array
   * defines the operation
   * > `Parent <op> ChildrenResult`
   *
   * next items are interpreted as
   * > `[Child N-1] <op> [Child N]`
   */
  op: Operator;
})[];
