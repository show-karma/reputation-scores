"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultWithDeworkDaoScoreProvider = void 0;
const get_weights_1 = require("../util/get-weights");
const interfaces_1 = require("./interfaces");
class DefaultWithDeworkDaoScoreProvider extends interfaces_1.BaseProvider {
    async preload(resourceName) {
        const resource = await (0, get_weights_1.getWeights)(resourceName || "default-with-dework");
        this.weights = resource;
    }
    // Used for score breakdown display
    getScoreBreakdownCalc(stat, period, type = "score") {
        const { score: { lifetime: karma }, forumScore: { lifetime: forum }, } = this.weights;
        switch (type) {
            case "forum": {
                return [
                    {
                        label: "Proposals Initiated",
                        value: (0, get_weights_1.coalesce)(stat.proposalsDiscussed, 0),
                        weight: (0, get_weights_1.coalesce)(forum.proposalsDiscussed, 1),
                    },
                    {
                        label: "Proposals Discussed",
                        op: "+",
                        value: (0, get_weights_1.coalesce)(stat.proposalsDiscussed, 0),
                        weight: (0, get_weights_1.coalesce)(forum.proposalsDiscussed, 1),
                    },
                    {
                        label: "Forum Post Count",
                        op: "+",
                        value: (0, get_weights_1.coalesce)(stat.forumPostCount, 0),
                        weight: (0, get_weights_1.coalesce)(forum.forumPostCount, 1),
                    },
                    {
                        label: "Forum Topic Count",
                        op: "+",
                        value: (0, get_weights_1.coalesce)(stat.forumTopicCount, 0),
                        weight: (0, get_weights_1.coalesce)(forum.forumTopicCount, 1),
                    },
                    {
                        label: "Forum Likes Received",
                        op: "+",
                        value: (0, get_weights_1.coalesce)(stat.forumLikesReceived, 0),
                        weight: (0, get_weights_1.coalesce)(forum.forumLikesReceived, 1),
                    },
                    {
                        label: "Forum Posts Read Count",
                        op: "+",
                        value: (0, get_weights_1.coalesce)(stat.forumPostsReadCount, 0),
                        weight: (0, get_weights_1.coalesce)(forum.forumPostsReadCount, 1),
                    },
                ];
            }
            case "score": {
                return [
                    {
                        label: "Forum Activity Score",
                        value: (0, get_weights_1.coalesce)(stat.forumActivityScore, 0),
                        weight: (0, get_weights_1.coalesce)(karma.forumActivityScore, 1),
                    },
                    {
                        label: "Off-chain Votes %",
                        value: (0, get_weights_1.coalesce)(stat.offChainVotesPct, 0),
                        weight: (0, get_weights_1.coalesce)(karma.offChainVotesPct, 1),
                        op: "+",
                    },
                    {
                        label: "On-chain Votes %",
                        value: (0, get_weights_1.coalesce)(stat.onChainVotesPct, 0),
                        weight: (0, get_weights_1.coalesce)(karma.onChainVotesPct, 1),
                        op: "+",
                    },
                    {
                        label: "Discord Message Percentile",
                        value: (0, get_weights_1.coalesce)(stat.discordMessagePercentile, 0),
                        weight: (0, get_weights_1.coalesce)(karma.discordMessagePercentile, 1),
                        op: "+",
                    },
                    {
                        label: "Dework Points",
                        value: (0, get_weights_1.coalesce)(stat.deworkPoints, 0),
                        weight: (0, get_weights_1.coalesce)(karma.deworkPoints, 1),
                        op: "+",
                    },
                ];
            }
        }
    }
    getForumScore(stat) {
        return (Math.round((stat.proposalsInitiated || 0) * 1 +
            (stat.proposalsDiscussed || 0) * 0.2 +
            (stat.forumPostCount || 0) * 0.1 +
            (stat.forumTopicCount || 0) * 0.3 +
            (stat.forumLikesReceived || 0) * 0.05 +
            (stat.forumPostsReadCount || 0) * 0.01) || 0);
    }
    getKarmaScore(stat, median) {
        return (Math.round((stat.forumActivityScore || 0) +
            (stat.offChainVotesPct || 0) * 3 +
            (stat.onChainVotesPct || 0) * 5 +
            (stat.discordMessagesCount || 0) * 0.01 +
            (stat.deworkPoints || 0) * 0.1) || 0);
    }
    getKarmaScoreProps() {
        return [
            "forumActivityScore",
            "offChainVotesPct",
            "onChainVotesPct",
            "discordMessagesCount",
            "deworkPoints",
        ];
    }
}
exports.DefaultWithDeworkDaoScoreProvider = DefaultWithDeworkDaoScoreProvider;
