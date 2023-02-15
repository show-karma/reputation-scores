"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDaoScoreProvider = void 0;
const interfaces_1 = require("./interfaces");
const get_weights_1 = require("../util/get-weights");
class DefaultDaoScoreProvider extends interfaces_1.BaseProvider {
    constructor(resourceName) {
        super(resourceName);
        this.resourceName = resourceName;
    }
    async preload(resourceName) {
        const resource = await (0, get_weights_1.getWeights)(resourceName || this.resourceName || "default");
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
        return (Math.round((stat.forumActivityScore || 0) *
            (0, get_weights_1.coalesce)(lifetime.forumActivityScore, 1) +
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
    getScoreBreakdownCalc(stat, period = interfaces_1.DelegateStatPeriod.lifetime, type = "score") {
        const { score: { lifetime: score = {} }, forumScore: { lifetime: forum = {} }, } = this.weights;
        if (type === "forum")
            return [
                {
                    label: "Proposals Inititated",
                    value: (0, get_weights_1.coalesce)(stat.proposalsInitiated),
                    weight: (0, get_weights_1.coalesce)(forum.proposalsInitiated),
                },
                {
                    label: "Proposals Discussed",
                    value: (0, get_weights_1.coalesce)(stat.proposalsDiscussed),
                    weight: (0, get_weights_1.coalesce)(forum.proposalsDiscussed),
                    op: "+",
                },
                {
                    label: "Forum Post Count",
                    value: (0, get_weights_1.coalesce)(stat.forumPostCount),
                    weight: (0, get_weights_1.coalesce)(forum.forumPostCount),
                    op: "+",
                },
                {
                    label: "Forum Topic Count",
                    value: (0, get_weights_1.coalesce)(stat.forumTopicCount),
                    weight: (0, get_weights_1.coalesce)(forum.forumTopicCount),
                    op: "+",
                },
                {
                    label: "Forum Likes Received",
                    value: (0, get_weights_1.coalesce)(stat.forumLikesReceived),
                    weight: (0, get_weights_1.coalesce)(forum.forumLikesReceived),
                    op: "+",
                },
                {
                    label: "Forum Posts Read Count",
                    value: (0, get_weights_1.coalesce)(stat.forumPostsReadCount),
                    weight: (0, get_weights_1.coalesce)(forum.forumPostsReadCount),
                    op: "+",
                },
            ];
        return [
            {
                label: "Forum Activity Score",
                value: (0, get_weights_1.coalesce)(stat.forumActivityScore),
                weight: (0, get_weights_1.coalesce)(score.forumActivityScore, 1),
            },
            {
                label: "Off-Chain Votes Pct",
                value: (0, get_weights_1.coalesce)(stat.offChainVotesPct),
                weight: (0, get_weights_1.coalesce)(score.offChainVotesPct, 1),
                op: "+",
            },
            {
                label: "On-Chain Votes Pct",
                value: (0, get_weights_1.coalesce)(stat.onChainVotesPct),
                weight: (0, get_weights_1.coalesce)(score.onChainVotesPct, 1),
                op: "+",
            },
            {
                label: "Discord Messages Count",
                value: (0, get_weights_1.coalesce)(stat.discordMessagesCount),
                weight: (0, get_weights_1.coalesce)(score.discordMessagesCount, 1),
                op: "+",
            },
        ];
    }
}
exports.DefaultDaoScoreProvider = DefaultDaoScoreProvider;
