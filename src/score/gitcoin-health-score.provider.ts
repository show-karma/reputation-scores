import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { DelegateStat, DelegateStatPeriod } from '../entities/delegate-stat.entity';
import { AdditionalScoreProvider } from './interfaces';

interface GithubRecord {
  address: string;
  steward_since: string;
  workstream: string;
}

const GITHUB_DATA_URL = 'https://www.daostewards.xyz/assets/stewards/stewards_data.json';

export class GitcoinHealthScoreProvider implements AdditionalScoreProvider {
  private githubData: Record<string, GithubRecord>;

  async preload(): Promise<void> {
    const data = (await axios.get(GITHUB_DATA_URL)).data.data as GithubRecord[];
    data.forEach((d) => {
      if (d.address) {
        d.address = d.address.toLowerCase();
      }
    });
    this.githubData = _.keyBy(data, 'address');
  }

  isPublicAddressEligible(publicAddress: string): Promise<boolean> {
    return Promise.resolve(!!this.githubData[publicAddress]);
  }

  async getScore(publicAddress: string, stat: Partial<DelegateStat>): Promise<number> {
    if (stat.period === DelegateStatPeriod.lifetime) {
      return this.getLifetimeScore(publicAddress, stat);
    } else if (stat.period === DelegateStatPeriod['30d']) {
      return this.get30dScore(publicAddress, stat);
    } else {
      throw new Error('Unknown period');
    }
  }

  private getLifetimeScore(publicAddress: string, stat: Partial<DelegateStat>): number {
    const karmaData = this.getKarmaData(stat, [
      'offChainVotesPct',
      'proposalsInitiated',
      'proposalsDiscussed',
      'forumTopicCount',
      'forumPostCount'
    ]);

    const score =
      karmaData.offChainVotesPct * 0.07 +
      (karmaData.proposalsInitiated * 1.5 +
        karmaData.proposalsDiscussed * 1 +
        (karmaData.forumTopicCount - karmaData.proposalsInitiated) * 1.1 +
        (karmaData.forumPostCount - karmaData.proposalsDiscussed) * 0.7) /
        Math.sqrt(this.getStewardDays(publicAddress)) +
      this.getWorkstreamInvolvement(publicAddress);

    return Math.floor(score);
  }

  private get30dScore(publicAddress: string, stat: Partial<DelegateStat>): number {
    const karmaData = this.getKarmaData(stat, [
      'offChainVotesPct',
      'proposalsInitiated',
      'proposalsDiscussed',
      'forumTopicCount',
      'forumPostCount'
    ]);

    const score =
      karmaData.offChainVotesPct * 0.07 +
      karmaData.proposalsInitiated * 1.5 +
      karmaData.proposalsDiscussed * 0.7 +
      (karmaData.forumTopicCount - karmaData.proposalsInitiated) * 1.1 +
      (karmaData.forumPostCount - karmaData.proposalsDiscussed) * 0.6 +
      this.getWorkstreamInvolvement(publicAddress);

    return Math.floor(score);
  }

  private getWorkstreamInvolvement(publicAddress: string): number {
    const workstream = this.githubData[publicAddress]?.workstream;
    if (workstream) {
      if (workstream) {
        const part = workstream.split(' ')[1]?.toLowerCase();
        if (part === 'lead') return 5;
        if (part === 'contributor') return 3;
      }
    }
    return 0;
  }

  private getStewardDays(publicAddress: string) {
    const stewardSince = this.githubData[publicAddress]?.steward_since;
    return Math.abs(moment.utc(stewardSince).diff(moment.utc(), 'days'));
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
