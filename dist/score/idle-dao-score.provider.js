"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdleDaoScoreProvider = void 0;
const get_weights_1 = require("../util/get-weights");
const interfaces_1 = require("./interfaces");
class IdleDaoScoreProvider extends interfaces_1.BaseProvider {
    async preload(resourceName = "idlefinance") {
        this.weights = await (0, get_weights_1.getWeights)(resourceName);
    }
    getForumScore(stat) {
        const { forumScore: { lifetime }, } = this.weights;
        const totalWeight = (0, get_weights_1.getTotalWeight)(lifetime);
        return (Math.round((((0, get_weights_1.coalesce)(stat.proposalsInitiatedPercentile) *
            (0, get_weights_1.coalesce)(lifetime?.proposalsInitiatedPercentile, 1) +
            (0, get_weights_1.coalesce)(stat.proposalsDiscussedPercentile) *
                (0, get_weights_1.coalesce)(lifetime?.proposalsDiscussedPercentile, 1) +
            (0, get_weights_1.coalesce)(stat.forumPostCountPercentile) *
                (0, get_weights_1.coalesce)(lifetime?.forumPostCountPercentile, 1) +
            (0, get_weights_1.coalesce)(stat.forumTopicCountPercentile) *
                (0, get_weights_1.coalesce)(lifetime?.forumTopicCountPercentile, 1) +
            (0, get_weights_1.coalesce)(stat.forumLikesReceivedPercentile) *
                (0, get_weights_1.coalesce)(lifetime?.forumLikesReceivedPercentile, 1) +
            (0, get_weights_1.coalesce)(stat.forumPostsReadCountPercentile) *
                (0, get_weights_1.coalesce)(lifetime?.forumPostsReadCountPercentile, 1)) /
            totalWeight) *
            100));
    }
    getKarmaScore(stat, median) {
        const { score: { lifetime }, } = this.weights;
        const totalWeight = (0, get_weights_1.getTotalWeight)(lifetime);
        return (Math.round((((0, get_weights_1.coalesce)(stat.voteWeight, 0) * (0, get_weights_1.coalesce)(lifetime.delegatedVotes, 1) +
            (0, get_weights_1.coalesce)(stat.forumActivityScore, 0) * (0, get_weights_1.coalesce)(lifetime.forumActivityScore, 1) +
            (0, get_weights_1.coalesce)(stat.offChainVotesPct, 0) * (0, get_weights_1.coalesce)(lifetime.offChainVotesPct, 1) +
            (0, get_weights_1.coalesce)(stat.onChainVotesPct, 0) * (0, get_weights_1.coalesce)(lifetime.onChainVotesPct, 1) +
            (0, get_weights_1.coalesce)(stat.discordMessagePercentile, 0) * (0, get_weights_1.coalesce)(lifetime.discordMessagePercentile, 1)) /
            totalWeight) * 100));
    }
    getKarmaScoreProps() {
        return [
            "delegatedVotes",
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
                    label: "Max Score Setting",
                    value: 100,
                    weight: 1,
                    childrenOp: "*",
                    children: [
                        {
                            label: "Proposals Initiated Percentile",
                            value: (0, get_weights_1.coalesce)(stat.proposalsDiscussedPercentile),
                            weight: (0, get_weights_1.coalesce)(forum?.proposalsDiscussedPercentile, 1),
                            op: "*",
                        },
                        {
                            label: "Proposals Discussed Percentile",
                            value: (0, get_weights_1.coalesce)(stat.proposalsInitiatedPercentile),
                            weight: (0, get_weights_1.coalesce)(forum?.proposalsInitiatedPercentile, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Post Count Percentile",
                            value: (0, get_weights_1.coalesce)(stat.forumPostCountPercentile),
                            weight: (0, get_weights_1.coalesce)(forum?.forumPostCountPercentile, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Topic Count Percentile",
                            value: (0, get_weights_1.coalesce)(stat.forumTopicCountPercentile),
                            weight: (0, get_weights_1.coalesce)(forum?.forumTopicCountPercentile, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Likes Received Percentile",
                            value: (0, get_weights_1.coalesce)(stat.forumLikesReceivedPercentile),
                            weight: (0, get_weights_1.coalesce)(forum?.forumLikesReceivedPercentile, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Posts Read Count Percentile",
                            value: (0, get_weights_1.coalesce)(stat.forumPostsReadCountPercentile),
                            weight: (0, get_weights_1.coalesce)(forum?.forumPostsReadCountPercentile, 1),
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
                        label: "Delegated Votes %",
                        value: (0, get_weights_1.coalesce)(stat.voteWeight, 0),
                        weight: (0, get_weights_1.coalesce)(score.delegatedVotes, 1),
                    },
                    {
                        label: "Forum Activity Score",
                        value: (0, get_weights_1.coalesce)(stat.forumActivityScore),
                        weight: (0, get_weights_1.coalesce)(score.forumActivityScore, 1),
                        op: "+",
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
exports.IdleDaoScoreProvider = IdleDaoScoreProvider;
