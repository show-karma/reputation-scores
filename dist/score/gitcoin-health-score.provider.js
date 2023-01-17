"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitcoinHealthScoreProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const interfaces_1 = require("./interfaces");
const get_weights_1 = require("../util/get-weights");
const GITHUB_DATA_URL = "https://www.daostewards.xyz/assets/stewards/stewards_data.json";
class GitcoinHealthScoreProvider {
    async preload() {
        const data = (await axios_1.default.get(GITHUB_DATA_URL)).data.data;
        data.forEach((d) => {
            if (d.address) {
                d.address = d.address.toLowerCase();
            }
        });
        this.githubData = lodash_1.default.keyBy(data, "address");
        this.multipliers = await (0, get_weights_1.getWeights)("gitcoin");
    }
    isPublicAddressEligible(publicAddress) {
        return Promise.resolve(!!this.githubData[publicAddress]);
    }
    async getScore(publicAddress, stat) {
        if (stat.period === interfaces_1.DelegateStatPeriod.lifetime) {
            return this.getLifetimeScore(publicAddress, stat);
        }
        else if (stat.period === interfaces_1.DelegateStatPeriod["30d"]) {
            return this.get30dScore(publicAddress, stat);
        }
        else if (stat.period === interfaces_1.DelegateStatPeriod["180d"]) {
            return Math.floor((await this.get30dScore(publicAddress, stat)) / 6);
        }
        else {
            // TODO fix it
            return this.get30dScore(publicAddress, stat);
        }
    }
    getLifetimeScore(publicAddress, stat) {
        const karmaData = this.getKarmaData(stat, [
            "offChainVotesPct",
            "proposalsInitiated",
            "proposalsDiscussed",
            "forumTopicCount",
            "forumPostCount",
        ]);
        const { healthScore: { lifetime = {} }, } = this.multipliers;
        const score = karmaData.offChainVotesPct * (0, get_weights_1.coalesce)(lifetime.offChainVotesPct, 1) +
            (karmaData.proposalsInitiated * (0, get_weights_1.coalesce)(lifetime.proposalsInitiated, 1) +
                karmaData.proposalsDiscussed *
                    (0, get_weights_1.coalesce)(lifetime.proposalsDiscussed, 1) +
                (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
                    (0, get_weights_1.coalesce)(lifetime["forumTopicCount-proposalsInitiated"], 1) +
                (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
                    (0, get_weights_1.coalesce)(lifetime["forumPostCount-proposalsDiscussed"]),
                1) /
                Math.sqrt(this.getStewardDays(publicAddress)) +
            this.getWorkstreamInvolvement(publicAddress);
        return Math.floor(score);
    }
    get30dScore(publicAddress, stat) {
        const karmaData = this.getKarmaData(stat, [
            "offChainVotesPct",
            "proposalsInitiated",
            "proposalsDiscussed",
            "forumTopicCount",
            "forumPostCount",
        ]);
        const { healthScore: { "30d": monthly = {} }, } = this.multipliers;
        const score = karmaData.offChainVotesPct * monthly.offChainVotesPct +
            karmaData.proposalsInitiated * monthly.proposalsInitiated +
            karmaData.proposalsDiscussed * monthly.proposalsDiscussed +
            (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
                monthly["forumTopicCount-proposalsInitiated"] +
            (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
                monthly["forumPostCount-proposalsDiscussed"] +
            this.getWorkstreamInvolvement(publicAddress);
        return Math.floor(score);
    }
    getWorkstreamInvolvement(publicAddress) {
        const { workstreamInvolvement } = this.multipliers;
        const workstreamsLead = this.githubData[publicAddress]?.workstreamsLead;
        const workstreamsContributor = this.githubData[publicAddress]?.workstreamsContributor;
        if (workstreamsLead)
            return (0, get_weights_1.coalesce)(workstreamInvolvement?.lead, 5);
        if (workstreamsContributor)
            return (0, get_weights_1.coalesce)(workstreamInvolvement?.contributor, 3);
        return (0, get_weights_1.coalesce)(workstreamInvolvement?.none, 0);
    }
    getStewardDays(publicAddress) {
        const stewardSince = this.githubData[publicAddress]?.steward_since;
        return Math.abs(moment_1.default.utc(stewardSince).diff(moment_1.default.utc(), "days"));
    }
    getKarmaData(stat, fields) {
        const result = {};
        for (const f of fields) {
            result[f.toString()] = stat[f] || 0;
        }
        return result;
    }
}
exports.GitcoinHealthScoreProvider = GitcoinHealthScoreProvider;
