import axios from "axios";
import _ from "lodash";
import moment from "moment";
import {
  AdditionalScoreProvider,
  DelegateStat,
  DelegateStatPeriod,
  ScoreBreakdownCalc,
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
  "https://raw.githubusercontent.com/mmmgtc/stewards-frontend/main/public/assets/stewards/stewards_data.json";

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
    this.weights = await getWeights("gitcoin");
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
      // return Math.floor(this.get30dScore(publicAddress, stat) / 6);
      return this.get180dScore(publicAddress, stat);
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
    } = this.weights;
    const score =
      karmaData.offChainVotesPct * coalesce(lifetime.offChainVotesPct, 1) +
      (karmaData.proposalsInitiated * coalesce(lifetime.proposalsInitiated, 1) +
        karmaData.proposalsDiscussed *
          coalesce(lifetime.proposalsDiscussed, 1) +
        (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
          coalesce(lifetime["forumTopicCount-proposalsInitiated"], 1) +
        (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
          coalesce(lifetime["forumPostCount-proposalsDiscussed"], 1)) /
        Math.sqrt(this.getStewardDays(publicAddress)) +
      this.getWorkstreamInvolvement(publicAddress);

    return Math.floor(score);
  }

  private get180dScore(
    publicAddress: string,
    stat: Partial<DelegateStat>
  ): number {
    const {
      healthScore: { "180d": weights = {} },
    } = this.weights;

    const karmaData = this.getKarmaData(stat, [
      "offChainVotesPct",
      "proposalsInitiated",
      "proposalsDiscussed",
      "forumTopicCount",
      "forumPostCount",
    ]);

    const score =
      (karmaData.offChainVotesPct * coalesce(weights.offChainVotesPct) +
        karmaData.proposalsInitiated * coalesce(weights.proposalsInitiated) +
        karmaData.proposalsDiscussed * coalesce(weights.proposalsDiscussed) +
        (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
          coalesce(weights["forumTopicCount-proposalsInitiated"]) +
        (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
          coalesce(weights["forumPostCount-proposalsDiscussed"]) +
        this.getWorkstreamInvolvement(publicAddress)) *
      (Math.min(180, this.getStewardDays(publicAddress)) / 180);

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
      healthScore: { "30d": weights = {} },
    } = this.weights;

    const score =
      karmaData.offChainVotesPct * coalesce(weights.offChainVotesPct) +
      karmaData.proposalsInitiated * coalesce(weights.proposalsInitiated) +
      karmaData.proposalsDiscussed * coalesce(weights.proposalsDiscussed) +
      (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
        coalesce(weights["forumTopicCount-proposalsInitiated"]) +
      (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
        coalesce(weights["forumPostCount-proposalsDiscussed"]) +
      this.getWorkstreamInvolvement(publicAddress);

    return Math.floor(score);
  }

  private getWorkstreamInvolvement(publicAddress: string): number {
    const { workstreamInvolvement } = this.weights;

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

  getDefaultBreakdown(
    stat: Partial<DelegateStat>,
    weights: Record<string, number>,
    workstreamScore?: number
  ): ScoreBreakdownCalc {
    const breakdown: ScoreBreakdownCalc = [
      {
        label: "Off-chain Votes %",
        value: coalesce(stat.offChainVotesPct),
        weight: coalesce(weights.offChainVotesPct),
      },
      {
        label: "Proposals Initiated",
        value: coalesce(stat.proposalsInitiated),
        weight: coalesce(weights.proposalsInitiated),
        op: "+",
      },
      {
        label: "Proposals Discussed",
        value: coalesce(stat.proposalsDiscussed),
        weight: coalesce(weights.proposalsDiscussed),
        op: "+",
      },
      {
        label: "Forum Topic Count - Proposals Initiated",
        value: coalesce(stat.forumTopicCount - stat.proposalsInitiated),
        weight: coalesce(weights["forumTopicCount-proposalsInitiated"]),
        op: "+",
      },
      {
        label: "Forum Post Count - Proposals Discussed",
        value: coalesce(stat.forumPostCount - stat.proposalsDiscussed),
        weight: coalesce(weights["forumPostCount-proposalsDiscussed"]),
        op: "+",
      },
    ];
    if (workstreamScore >= 0)
      breakdown.push({
        label: `Workstream Involvement - ${
          workstreamScore === 5
            ? "Lead"
            : workstreamScore === 3
            ? "Contributor"
            : "None"
        }`,
        value: workstreamScore,
        weight: 1,
        op: "+",
      });

    return breakdown;
  }

  getScoreBreakdownCalc(
    publicAddress: string,
    stat: Partial<DelegateStat>,
    period?: DelegateStatPeriod,
    type?: "forum" | "score"
  ): ScoreBreakdownCalc {
    const workstreamScore = this.getWorkstreamInvolvement(publicAddress);
    const stewardDays = this.getStewardDays(publicAddress);
    switch (period) {
      case DelegateStatPeriod["lifetime"]: {
        const {
          healthScore: { lifetime: weights },
        } = this.weights;
        const defaultBreakdown = this.getDefaultBreakdown(stat, weights);
        const offChainVotesObj = defaultBreakdown.shift();
        delete defaultBreakdown[0].op;

        return [
          {
            label: `Workstream Involvement - ${
              workstreamScore === 5
                ? "Lead"
                : workstreamScore === 3
                ? "Contributor"
                : "None"
            }`,
            value: workstreamScore,
            weight: 1,
          },
          {
            ...offChainVotesObj,
            op: "+",
            childrenOp: "+",
            children: [
              {
                label: "Forum Score",
                children: defaultBreakdown,
              },
              {
                label: `Square root of Steward Days (${stewardDays})`,
                value: +Math.sqrt(stewardDays).toFixed(6),
                weight: 1,
                op: "/",
              },
            ],
          },
        ];
      }
      case DelegateStatPeriod["180d"]: {
        const {
          healthScore: { "180d": weights },
        } = this.weights;

        return [
          {
            label: "Steward days (0-180)",
            value: Math.min(180, stewardDays),
            // 1/180 ~ 0.005
            weight: 0.00556,
          },
          {
            label: "Forum Score",
            op: "+",
            children: this.getDefaultBreakdown(stat, weights, workstreamScore),
          },
        ];
      }
      default: {
        const {
          healthScore: { "30d": weights },
        } = this.weights;
        return this.getDefaultBreakdown(stat, weights, workstreamScore);
      }
    }
  }
}
