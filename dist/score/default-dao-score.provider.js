"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDaoScoreProvider = void 0;
const interfaces_1 = require("./interfaces");
const get_weights_1 = require("../util/get-weights");
class DefaultDaoScoreProvider extends interfaces_1.BaseProvider {
    async preload(resourceName) {
        const resource = await (0, get_weights_1.getWeights)(resourceName);
        this.weights = resource;
    }
    getForumScore(stat) {
        const { forumScore: { lifetime = {} }, } = this.weights;
        return (Math.round(stat.proposalsInitiated * (0, get_weights_1.coalesce)(lifetime.proposalsInitiated, 1) +
            stat.proposalsDiscussed * (0, get_weights_1.coalesce)(lifetime.proposalsDiscussed, 1) +
            stat.forumPostCount * (0, get_weights_1.coalesce)(lifetime.forumPostCount, 1) +
            stat.forumTopicCount * (0, get_weights_1.coalesce)(lifetime.forumTopicCount, 1) +
            stat.forumLikesReceived * (0, get_weights_1.coalesce)(lifetime.forumLikesReceived, 1) +
            stat.forumPostsReadCount * (0, get_weights_1.coalesce)(lifetime.forumPostsReadCount, 1)) || 0);
    }
    getKarmaScore(stat, median) {
        const { score: { lifetime = {} }, } = this.weights;
        return (Math.round(stat.forumActivityScore ||
            0 * (0, get_weights_1.coalesce)(lifetime.forumActivityScore, 1) +
                (stat.offChainVotesPct || 0) *
                    (0, get_weights_1.coalesce)(lifetime.offChainVotesPct, 1) +
                (stat.onChainVotesPct || 0) *
                    (0, get_weights_1.coalesce)(lifetime.onChainVotesPct, 1) +
                (stat.discordMessagesCount || 0) *
                    (0, get_weights_1.coalesce)(lifetime.discordMessagesCount, 1)) || 0);
    }
    getKarmaScoreProps() {
        return [
            "forumActivityScore",
            "offChainVotesPct",
            "onChainVotesPct",
            "discordMessagesCount",
        ];
    }
    getScoreBreakdownCalc(stat, period = interfaces_1.DelegateStatPeriod.lifetime) {
        const { score: { lifetime = {} }, } = this.weights;
        return [
            {
                label: "Forum Activity Score",
                value: (0, get_weights_1.coalesce)(stat.forumActivityScore),
                weight: (0, get_weights_1.coalesce)(lifetime.forumActivityScore, 1),
            },
            {
                label: "Off-Chain Votes Pct",
                value: (0, get_weights_1.coalesce)(stat.offChainVotesPct),
                weight: (0, get_weights_1.coalesce)(lifetime.offChainVotesPct, 1),
                op: "+",
            },
            {
                label: "On-Chain Votes Pct",
                value: (0, get_weights_1.coalesce)(stat.onChainVotesPct),
                weight: (0, get_weights_1.coalesce)(lifetime.onChainVotesPct, 1),
            },
            {
                label: "Discord Messages Count",
                value: (0, get_weights_1.coalesce)(stat.discordMessagesCount),
                weight: (0, get_weights_1.coalesce)(lifetime.discordMessagesCount, 1),
                op: "+",
            },
        ];
    }
}
exports.DefaultDaoScoreProvider = DefaultDaoScoreProvider;
