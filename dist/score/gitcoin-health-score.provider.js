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
const GITHUB_DATA_URL = "https://raw.githubusercontent.com/mmmgtc/stewards-frontend/main/public/assets/stewards/stewards_data.json";
class GitcoinHealthScoreProvider {
    async preload() {
        const data = (await axios_1.default.get(GITHUB_DATA_URL)).data.data;
        data.forEach((d) => {
            if (d.address) {
                d.address = d.address.toLowerCase();
            }
        });
        this.githubData = lodash_1.default.keyBy(data, "address");
        this.weights = await (0, get_weights_1.getWeights)("gitcoin");
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
            // return Math.floor(this.get30dScore(publicAddress, stat) / 6);
            return this.get180dScore(publicAddress, stat);
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
        const { healthScore: { lifetime = {} }, } = this.weights;
        const score = karmaData.offChainVotesPct * (0, get_weights_1.coalesce)(lifetime.offChainVotesPct, 1) +
            (karmaData.proposalsInitiated * (0, get_weights_1.coalesce)(lifetime.proposalsInitiated, 1) +
                karmaData.proposalsDiscussed *
                    (0, get_weights_1.coalesce)(lifetime.proposalsDiscussed, 1) +
                (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
                    (0, get_weights_1.coalesce)(lifetime["forumTopicCount-proposalsInitiated"], 1) +
                (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
                    (0, get_weights_1.coalesce)(lifetime["forumPostCount-proposalsDiscussed"], 1)) /
                Math.sqrt(this.getStewardDays(publicAddress)) +
            this.getWorkstreamInvolvement(publicAddress);
        return Math.floor(score);
    }
    get180dScore(publicAddress, stat) {
        const { healthScore: { "180d": weights = {} }, } = this.weights;
        const karmaData = this.getKarmaData(stat, [
            "offChainVotesPct",
            "proposalsInitiated",
            "proposalsDiscussed",
            "forumTopicCount",
            "forumPostCount",
        ]);
        const score = (karmaData.offChainVotesPct * (0, get_weights_1.coalesce)(weights.offChainVotesPct) +
            karmaData.proposalsInitiated * (0, get_weights_1.coalesce)(weights.proposalsInitiated) +
            karmaData.proposalsDiscussed * (0, get_weights_1.coalesce)(weights.proposalsDiscussed) +
            (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
                (0, get_weights_1.coalesce)(weights["forumTopicCount-proposalsInitiated"]) +
            (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
                (0, get_weights_1.coalesce)(weights["forumPostCount-proposalsDiscussed"]) +
            this.getWorkstreamInvolvement(publicAddress)) *
            (Math.min(180, this.getStewardDays(publicAddress)) / 180);
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
        const { healthScore: { "30d": weights = {} }, } = this.weights;
        const score = karmaData.offChainVotesPct * (0, get_weights_1.coalesce)(weights.offChainVotesPct) +
            karmaData.proposalsInitiated * (0, get_weights_1.coalesce)(weights.proposalsInitiated) +
            karmaData.proposalsDiscussed * (0, get_weights_1.coalesce)(weights.proposalsDiscussed) +
            (karmaData.forumTopicCount - karmaData.proposalsInitiated) *
                (0, get_weights_1.coalesce)(weights["forumTopicCount-proposalsInitiated"]) +
            (karmaData.forumPostCount - karmaData.proposalsDiscussed) *
                (0, get_weights_1.coalesce)(weights["forumPostCount-proposalsDiscussed"]) +
            this.getWorkstreamInvolvement(publicAddress);
        return Math.floor(score);
    }
    getWorkstreamInvolvement(publicAddress) {
        const { workstreamInvolvement } = this.weights;
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
    getDefaultBreakdown(stat, weights, workstreamScore) {
        const breakdown = [
            {
                label: "Off-chain Votes %",
                value: (0, get_weights_1.coalesce)(stat.offChainVotesPct),
                weight: (0, get_weights_1.coalesce)(weights.offChainVotesPct),
            },
            {
                label: "Proposals Initiated",
                value: (0, get_weights_1.coalesce)(stat.proposalsInitiated),
                weight: (0, get_weights_1.coalesce)(weights.proposalsInitiated),
                op: "+",
            },
            {
                label: "Proposals Discussed",
                value: (0, get_weights_1.coalesce)(stat.proposalsDiscussed),
                weight: (0, get_weights_1.coalesce)(weights.proposalsDiscussed),
                op: "+",
            },
            {
                label: "Forum Topic Count - Proposals Initiated",
                value: (0, get_weights_1.coalesce)(stat.forumTopicCount - stat.proposalsInitiated),
                weight: (0, get_weights_1.coalesce)(weights["forumTopicCount-proposalsInitiated"]),
                op: "+",
            },
            {
                label: "Forum Post Count - Proposals Discussed",
                value: (0, get_weights_1.coalesce)(stat.forumPostCount - stat.proposalsDiscussed),
                weight: (0, get_weights_1.coalesce)(weights["forumPostCount-proposalsDiscussed"]),
                op: "+",
            },
        ];
        if (workstreamScore >= 0)
            breakdown.push({
                label: `Workstream Involvement: ${workstreamScore === 5
                    ? "Lead"
                    : workstreamScore === 3
                        ? "Contributor"
                        : "None"}`,
                value: workstreamScore,
                weight: 1,
                op: "+",
            });
        return breakdown;
    }
    getScoreBreakdownCalc(publicAddress, stat, period, type) {
        const workstreamScore = this.getWorkstreamInvolvement(publicAddress);
        switch (period) {
            case interfaces_1.DelegateStatPeriod["lifetime"]: {
                const { healthScore: { lifetime: weights }, } = this.weights;
                const defaultBreakdown = this.getDefaultBreakdown(stat, weights, workstreamScore);
                const offChainVotesObj = defaultBreakdown.shift();
                offChainVotesObj.children = defaultBreakdown;
                delete offChainVotesObj.children[0].op;
                return [
                    { ...offChainVotesObj, childrenOp: "+" },
                    {
                        label: `Square root of Steward Days (0-180)`,
                        value: Math.min(180, this.getStewardDays(publicAddress)),
                        weight: 1,
                        op: "/",
                    },
                    {
                        label: `Workstream Involvement: ${workstreamScore === 5
                            ? "Lead"
                            : workstreamScore === 3
                                ? "Contributor"
                                : "None"}`,
                        value: workstreamScore,
                        weight: 1,
                        op: "+",
                    },
                ];
            }
            case interfaces_1.DelegateStatPeriod["180d"]: {
                const { healthScore: { "180d": weights }, } = this.weights;
                return [
                    {
                        label: "Steward days (0-180)",
                        value: Math.min(180, this.getStewardDays(publicAddress)),
                        // 1/180 ~ 0.005
                        weight: 0.00556,
                        op: "*",
                        childrenOp: "+",
                        children: this.getDefaultBreakdown(stat, weights, workstreamScore),
                    },
                ];
            }
            default: {
                const { healthScore: { "30d": weights }, } = this.weights;
                return this.getDefaultBreakdown(stat, weights, workstreamScore);
            }
        }
    }
}
exports.GitcoinHealthScoreProvider = GitcoinHealthScoreProvider;
