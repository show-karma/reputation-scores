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
const GITHUB_DATA_URL = 'https://www.daostewards.xyz/assets/stewards/stewards_data.json';
class GitcoinHealthScoreProvider {
    async preload() {
        const data = (await axios_1.default.get(GITHUB_DATA_URL)).data.data;
        data.forEach((d) => {
            if (d.address) {
                d.address = d.address.toLowerCase();
            }
        });
        this.githubData = lodash_1.default.keyBy(data, 'address');
    }
    isPublicAddressEligible(publicAddress) {
        return Promise.resolve(!!this.githubData[publicAddress]);
    }
    async getScore(publicAddress, stat) {
        if (stat.period === interfaces_1.DelegateStatPeriod.lifetime) {
            return this.getLifetimeScore(publicAddress, stat);
        }
        else if (stat.period === interfaces_1.DelegateStatPeriod['30d']) {
            return this.get30dScore(publicAddress, stat);
        }
        else if (stat.period === interfaces_1.DelegateStatPeriod['180d']) {
            return this.get30dScore(publicAddress, stat) / 6;
        }
        else {
            // TODO fix it
            return this.get30dScore(publicAddress, stat);
        }
    }
    getLifetimeScore(publicAddress, stat) {
        const karmaData = this.getKarmaData(stat, [
            'offChainVotesPct',
            'proposalsInitiated',
            'proposalsDiscussed',
            'forumTopicCount',
            'forumPostCount'
        ]);
        const score = karmaData.offChainVotesPct * 0.7 +
            (karmaData.proposalsInitiated * 1.5 +
                karmaData.proposalsDiscussed * 1 +
                (karmaData.forumTopicCount - karmaData.proposalsInitiated) * 1.1 +
                (karmaData.forumPostCount - karmaData.proposalsDiscussed) * 0.7) /
                Math.sqrt(this.getStewardDays(publicAddress)) +
            this.getWorkstreamInvolvement(publicAddress);
        return Math.floor(score);
    }
    get30dScore(publicAddress, stat) {
        const karmaData = this.getKarmaData(stat, [
            'offChainVotesPct',
            'proposalsInitiated',
            'proposalsDiscussed',
            'forumTopicCount',
            'forumPostCount'
        ]);
        const score = karmaData.offChainVotesPct * 0.7 +
            karmaData.proposalsInitiated * 1.5 +
            karmaData.proposalsDiscussed * 0.7 +
            (karmaData.forumTopicCount - karmaData.proposalsInitiated) * 1.1 +
            (karmaData.forumPostCount - karmaData.proposalsDiscussed) * 0.6 +
            this.getWorkstreamInvolvement(publicAddress);
        return Math.floor(score);
    }
    getWorkstreamInvolvement(publicAddress) {
        const workstreamsLead = this.githubData[publicAddress]?.workstreamsLead;
        const workstreamsContributor = this.githubData[publicAddress]?.workstreamsContributor;
        if (workstreamsLead)
            return 5;
        if (workstreamsContributor)
            return 3;
        return 0;
    }
    getStewardDays(publicAddress) {
        const stewardSince = this.githubData[publicAddress]?.steward_since;
        return Math.abs(moment_1.default.utc(stewardSince).diff(moment_1.default.utc(), 'days'));
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
