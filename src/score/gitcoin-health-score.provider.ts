import axios from "axios";
import _ from "lodash";
import moment from "moment";
import {
  AdditionalScoreProvider,
  DelegateStat,
  DelegateStatPeriod,
  ScoreMultiplier,
} from "./interfaces";
import { getWeights, coalesce } from "../util/get-weights";

interface GithubRecord {
  address: string;
  steward_since: string;
  workstream: string;
  workstreamsLead: string;
  workstreamsContributor: string;
}

const GITHUB_DATA_URL =
  "https://www.daostewards.xyz/assets/stewards/stewards_data.json";

export class GitcoinHealthScoreProvider implements AdditionalScoreProvider {
  private githubData: Record<string, GithubRecord>;
  private weights: ScoreMultiplier;

  async preload(): Promise<void> {
    const data = (await axios.get(GITHUB_DATA_URL)).data.data as GithubRecord[];
    data.forEach((d) => {
      if (d.address) {
        d.address = d.address.toLowerCase();
      }
    });
    this.githubData = _.keyBy(data, "address");
    this.multipliers = await getWeights("gitcoin");
  }

  isPublicAddressEligible(publicAddress: string): Promise<boolean> {
    return Promise.resolve(!!this.githubData[publicAddress]);
  }

  async getScore(
    publicAddress: string,
    stat: Partial<DelegateStat>
  ): Promise<number> {
    if (stat.period === DelegateStatPeriod.lifetime) {
      return this.getLifetimeScore(publicAddress, stat);
    } else if (stat.period === DelegateStatPeriod["30d"]) {
      return this.get30dScore(publicAddress, stat);
    } else if (stat.period === DelegateStatPeriod["180d"]) {
      return Math.floor(this.get30dScore(publicAddress, stat) / 6);
    } else {
      // TODO fix it
      return this.get30dScore(publicAddress, stat);
    }
  }

  private getLifetimeScore(
    publicAddress: string,
    stat: Partial<DelegateStat>
  ): number {
    const karmaData = this.getKarmaData(stat, [
      "offChainVotesPct",
      "proposalsInitiated",
      "proposalsDiscussed",
      "forumTopicCount",
      "forumPostCount",
    ]);

    const {
      healthScore: { lifetime = {} },
    } = this.multipliers;

    const score =
      karmaData.offChainVotesPct * coalesce(lifetime.offChainVotesPct, 1) +
      (karmaData.proposalsInitiated * coalesce(lifetime.proposalsInitiated, 1) +
        karmaData.proposalsDiscussed *
          coalesce(lifetime.proposalsDiscussed, 1) +
        (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
          coalesce(lifetime["forumTopicCount-proposalsInitiated"], 1) +
        (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
          coalesce(lifetime["forumPostCount-proposalsDiscussed"]),
      1) /
        Math.sqrt(this.getStewardDays(publicAddress)) +
      this.getWorkstreamInvolvement(publicAddress);

    return Math.floor(score);
  }

  private get30dScore(
    publicAddress: string,
    stat: Partial<DelegateStat>
  ): number {
    const karmaData = this.getKarmaData(stat, [
      "offChainVotesPct",
      "proposalsInitiated",
      "proposalsDiscussed",
      "forumTopicCount",
      "forumPostCount",
    ]);

    const {
      healthScore: { "30d": monthly = {} },
    } = this.multipliers;

    const score =
      karmaData.offChainVotesPct * monthly.offChainVotesPct +
      karmaData.proposalsInitiated * monthly.proposalsInitiated +
      karmaData.proposalsDiscussed * monthly.proposalsDiscussed +
      (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
        monthly["forumTopicCount-proposalsInitiated"] +
      (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
        monthly["forumPostCount-proposalsDiscussed"] +
      this.getWorkstreamInvolvement(publicAddress);

    return Math.floor(score);
  }

  private getWorkstreamInvolvement(publicAddress: string): number {
    const { workstreamInvolvement } = this.multipliers;

    const workstreamsLead = this.githubData[publicAddress]?.workstreamsLead;
    const workstreamsContributor =
      this.githubData[publicAddress]?.workstreamsContributor;

    if (workstreamsLead) return coalesce(workstreamInvolvement?.lead, 5);

    if (workstreamsContributor)
      return coalesce(workstreamInvolvement?.contributor, 3);

    return coalesce(workstreamInvolvement?.none, 0);
  }

  private getStewardDays(publicAddress: string) {
    const stewardSince = this.githubData[publicAddress]?.steward_since;
    return Math.abs(moment.utc(stewardSince).diff(moment.utc(), "days"));
  }

  private getKarmaData<T extends keyof Partial<DelegateStat>>(
    stat: Partial<DelegateStat>,
    fields: T[]
  ) {
    const result = {};

    for (const f of fields) {
      result[f.toString()] = stat[f] || 0;
    }

    return result as { [K in T]: DelegateStat[K] | 0 };
  }
}
