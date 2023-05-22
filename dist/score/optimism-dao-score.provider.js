"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimismDaoScoreProvider = void 0;
const get_weights_1 = require("../util/get-weights");
const interfaces_1 = require("./interfaces");
class OptimismDaoScoreProvider extends interfaces_1.BaseProvider {
    async preload(resourceName = "optimism") {
        this.weights = await (0, get_weights_1.getWeights)(resourceName);
    }
    getForumScore(stat) {
        const { forumScore: { lifetime = {} }, } = this.weights;
        const totalWeight = (0, get_weights_1.getTotalWeight)(lifetime);
        return Math.round((((0, get_weights_1.coalesce)(stat.proposalsInitiatedPercentile, 0) *
            (0, get_weights_1.coalesce)(lifetime.proposalsInitiated, 1) +
            (0, get_weights_1.coalesce)(stat.proposalsDiscussedPercentile, 0) *
                (0, get_weights_1.coalesce)(lifetime.proposalsDiscussed, 1) +
            (0, get_weights_1.coalesce)(stat.forumPostCountPercentile, 0) *
                (0, get_weights_1.coalesce)(lifetime.forumPostCount, 1) +
            (0, get_weights_1.coalesce)(stat.forumTopicCountPercentile, 0) *
                (0, get_weights_1.coalesce)(lifetime.forumTopicCount, 1) +
            (0, get_weights_1.coalesce)(stat.forumLikesReceivedPercentile, 0) *
                (0, get_weights_1.coalesce)(lifetime.forumLikesReceived, 1) +
            (0, get_weights_1.coalesce)(stat.forumPostsReadCountPercentile, 0) *
                (0, get_weights_1.coalesce)(lifetime.forumPostsReadCount, 1)) /
            totalWeight) *
            100);
    }
    getKarmaScore(stat, median) {
        const { score: { lifetime }, } = this.weights;
        const totalWeight = (0, get_weights_1.getTotalWeight)(lifetime);
        return Math.round((((0, get_weights_1.coalesce)(stat.voteWeight, 0) * (0, get_weights_1.coalesce)(lifetime.delegatedVotes, 1) +
            (0, get_weights_1.coalesce)(stat.offChainVotesPct, 0) *
                (0, get_weights_1.coalesce)(lifetime.offChainVotesPct, 1)) /
            totalWeight) *
            100);
    }
    getKarmaScoreProps() {
        return ["delegatedVotes", "offChainVotesPct"];
    }
    getScoreBreakdownCalc(stat, period, type = "score") {
        const { score: { lifetime = {} }, forumScore: { lifetime: forum = {} }, } = this.weights;
        if (type === "forum")
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
                    ],
                },
                {
                    label: "Total Weight",
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
                        label: "Delegated Votes %",
                        value: (0, get_weights_1.coalesce)(stat.voteWeight),
                        weight: (0, get_weights_1.coalesce)(lifetime.delegatedVotes),
                    },
                    {
                        label: "Off chain votes %",
                        value: (0, get_weights_1.coalesce)(stat.offChainVotesPct),
                        weight: (0, get_weights_1.coalesce)(lifetime.offChainVotesPct),
                        op: "+",
                    },
                ],
            },
            {
                label: "Total Weight",
                value: (0, get_weights_1.getTotalWeight)(lifetime),
                weight: 1,
                op: "/",
            },
        ];
    }
}
exports.OptimismDaoScoreProvider = OptimismDaoScoreProvider;
