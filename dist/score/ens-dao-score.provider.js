"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsDaoScoreProvider = void 0;
const get_weights_1 = require("../util/get-weights");
const interfaces_1 = require("./interfaces");
class EnsDaoScoreProvider extends interfaces_1.BaseProvider {
    constructor(resourceName) {
        super(resourceName);
        this.resourceName = resourceName;
    }
    async preload(resourceName) {
        this.weights = await (0, get_weights_1.getWeights)(resourceName || this.resourceName || "ens");
    }
    getForumScore(stat) {
        const { forumScore: { lifetime = {} }, } = this.weights;
        const totalWeight = (0, get_weights_1.getTotalWeight)(lifetime);
        return Math.round((((0, get_weights_1.coalesce)(stat.proposalsInitiated, 0) *
            (0, get_weights_1.coalesce)(lifetime.proposalsInitiated, 1) +
            (0, get_weights_1.coalesce)(stat.proposalsDiscussed, 0) *
                (0, get_weights_1.coalesce)(lifetime.proposalsDiscussed, 1) +
            (0, get_weights_1.coalesce)(stat.forumPostCount, 0) *
                (0, get_weights_1.coalesce)(lifetime.forumPostCount, 1) +
            (0, get_weights_1.coalesce)(stat.forumTopicCount, 0) *
                (0, get_weights_1.coalesce)(lifetime.forumTopicCount, 1) +
            (0, get_weights_1.coalesce)(stat.forumLikesReceived, 0) *
                (0, get_weights_1.coalesce)(lifetime.forumLikesReceived, 1) +
            (0, get_weights_1.coalesce)(stat.forumPostsReadCount, 0) *
                (0, get_weights_1.coalesce)(lifetime.forumPostsReadCount, 1)) /
            totalWeight) *
            100);
    }
    getKarmaScore(stat, median) {
        const { score: { lifetime = {} }, } = this.weights;
        const totalWeight = (0, get_weights_1.getTotalWeight)(lifetime);
        return Math.round((((0, get_weights_1.coalesce)(stat.forumActivityScore, 0) *
            (0, get_weights_1.coalesce)(lifetime.forumActivityScore, 1) +
            (0, get_weights_1.coalesce)(stat.offChainVotesPct, 0) *
                (0, get_weights_1.coalesce)(lifetime.offChainVotesPct, 1) +
            (0, get_weights_1.coalesce)(stat.onChainVotesPct, 0) *
                (0, get_weights_1.coalesce)(lifetime.onChainVotesPct, 1) +
            (0, get_weights_1.coalesce)(stat.discordMessagesCount, 0) *
                (0, get_weights_1.coalesce)(lifetime.discordMessagesCount, 1)) /
            totalWeight) *
            100);
    }
    getKarmaScoreProps() {
        return [
            "forumActivityScore",
            "offChainVotesPct",
            "onChainVotesPct",
            "discordMessagesCount",
        ];
    }
    getScoreBreakdownCalc(stat, period, type = "score") {
        const { score: { lifetime: score }, forumScore: { lifetime: forum }, } = this.weights;
        if (type == "forum")
            return [
                {
                    label: "Max Score Setting",
                    value: 100,
                    weight: 1,
                    childrenOp: "*",
                    children: [
                        {
                            label: "Proposals Initiated",
                            value: (0, get_weights_1.coalesce)(stat.proposalsInitiated),
                            weight: (0, get_weights_1.coalesce)(forum.proposalsInitiated, 1),
                            op: "*",
                        },
                        {
                            label: "Proposals Discussed",
                            value: (0, get_weights_1.coalesce)(stat.proposalsDiscussed),
                            weight: (0, get_weights_1.coalesce)(forum.proposalsDiscussed, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Post Count",
                            value: (0, get_weights_1.coalesce)(stat.forumPostCount),
                            weight: (0, get_weights_1.coalesce)(forum.forumPostCount, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Topic Count ",
                            value: (0, get_weights_1.coalesce)(stat.forumTopicCount),
                            weight: (0, get_weights_1.coalesce)(forum.forumTopicCount, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Likes Received",
                            value: (0, get_weights_1.coalesce)(stat.forumLikesReceived),
                            weight: (0, get_weights_1.coalesce)(forum.forumLikesReceived, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Posts Read Count",
                            value: (0, get_weights_1.coalesce)(stat.forumPostsReadCount),
                            weight: (0, get_weights_1.coalesce)(forum.forumPostsReadCount, 1),
                            op: "+",
                        },
                    ],
                },
                {
                    label: "Sum of Weights times Max Score Setting",
                    value: (0, get_weights_1.getTotalWeight)(forum),
                    weight: 1,
                    op: "/",
                },
            ];
        return [
            {
                label: "Max Score Setting",
                value: 100,
                weight: 1,
                childrenOp: "*",
                children: [
                    {
                        label: "Forum Activity Score",
                        value: (0, get_weights_1.coalesce)(stat.forumActivityScore),
                        weight: (0, get_weights_1.coalesce)(score.forumActivityScore, 1),
                        op: "*",
                    },
                    {
                        label: "Off-chain Votes %",
                        value: (0, get_weights_1.coalesce)(stat.offChainVotesPct),
                        weight: (0, get_weights_1.coalesce)(score.offChainVotesPct, 1),
                        op: "+",
                    },
                    {
                        label: "On-chain Votes %",
                        value: (0, get_weights_1.coalesce)(stat.onChainVotesPct),
                        weight: (0, get_weights_1.coalesce)(score.onChainVotesPct, 1),
                        op: "+",
                    },
                    {
                        label: "Discord Messages %",
                        value: (0, get_weights_1.coalesce)(stat.discordMessagesCount),
                        weight: (0, get_weights_1.coalesce)(score.discordMessagesCount, 1),
                        op: "+",
                    },
                ],
            },
            {
                label: "Sum of Weights times Max Score Setting",
                value: (0, get_weights_1.getTotalWeight)(score),
                weight: 1,
                op: "/",
            },
        ];
    }
}
exports.EnsDaoScoreProvider = EnsDaoScoreProvider;
