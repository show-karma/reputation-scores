"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDaoPercentileScoreProvider = void 0;
const get_weights_1 = require("../util/get-weights");
const interfaces_1 = require("./interfaces");
class DefaultDaoPercentileScoreProvider extends interfaces_1.BaseProvider {
    async preload() {
        this.weights = await (0, get_weights_1.getWeights)("default-percentile");
    }
    // max here 100 + 20 + 10 + 30 + 5 + 1 = 166
    getForumScore(stat) {
        const { forumScore: { lifetime }, } = this.weights;
        const totalWeight = (0, get_weights_1.getTotalWeight)(lifetime);
        return (Math.round(((stat.proposalsInitiatedPercentile *
            (0, get_weights_1.coalesce)(lifetime.proposalsInitiatedPercentile, 1) +
            stat.proposalsDiscussedPercentile *
                (0, get_weights_1.coalesce)(lifetime.proposalsDiscussedPercentile, 1) +
            stat.forumPostCountPercentile *
                (0, get_weights_1.coalesce)(lifetime.forumPostCountPercentile, 1) +
            stat.forumTopicCountPercentile *
                (0, get_weights_1.coalesce)(lifetime.forumTopicCountPercentile, 1) +
            stat.forumLikesReceivedPercentile *
                (0, get_weights_1.coalesce)(lifetime.forumLikesReceivedPercentile, 1) +
            stat.forumPostsReadCountPercentile *
                (0, get_weights_1.coalesce)(lifetime.forumPostsReadCountPercentile, 1)) /
            totalWeight) *
            100) || 0);
    }
    // max here 100 + 300 + 500 + 1 = 901
    getKarmaScore(stat, median) {
        const { score: { lifetime }, } = this.weights;
        const totalWeight = (0, get_weights_1.getTotalWeight)(lifetime);
        return (Math.round(((stat.forumActivityScore * (0, get_weights_1.coalesce)(lifetime.forumActivityScore) +
            (stat.offChainVotesPct || 0) * (0, get_weights_1.coalesce)(lifetime.offChainVotesPct) +
            (stat.onChainVotesPct || 0) * (0, get_weights_1.coalesce)(lifetime.onChainVotesPct) +
            (stat.discordMessagePercentile || 0) *
                (0, get_weights_1.coalesce)(lifetime.discordMessagePercentile)) /
            totalWeight) *
            100) || 0);
    }
    getKarmaScoreProps() {
        return [
            "forumActivityScore",
            "offChainVotesPct",
            "onChainVotesPct",
            "discordMessagePercentile",
        ];
    }
    getScoreBreakdownCalc(stat, period, type = "score") {
        const { score: { lifetime: score }, forumScore: { lifetime: forum }, } = this.weights;
        if (type == "forum")
            return [
                {
                    label: "Percent Multiplier",
                    value: 100,
                    weight: 1,
                    children: [
                        {
                            label: "Proposals Initiated Percentile",
                            value: (0, get_weights_1.coalesce)(stat.proposalsDiscussedPercentile),
                            weight: (0, get_weights_1.coalesce)(forum.proposalsDiscussedPercentile, 1),
                            op: "*",
                        },
                        {
                            label: "Proposals Discussed Percentile",
                            value: (0, get_weights_1.coalesce)(stat.proposalsInitiatedPercentile),
                            weight: (0, get_weights_1.coalesce)(forum.proposalsInitiatedPercentile, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Post Count Percentile",
                            value: (0, get_weights_1.coalesce)(stat.forumPostCountPercentile),
                            weight: (0, get_weights_1.coalesce)(forum.forumPostCountPercentile, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Topic Count Percentile",
                            value: (0, get_weights_1.coalesce)(stat.forumTopicCountPercentile),
                            weight: (0, get_weights_1.coalesce)(forum.forumTopicCountPercentile, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Likes Received Percentile",
                            value: (0, get_weights_1.coalesce)(stat.forumLikesReceivedPercentile),
                            weight: (0, get_weights_1.coalesce)(forum.forumLikesReceivedPercentile, 1),
                            op: "+",
                        },
                        {
                            label: "Forum Posts Read Count Percentile",
                            value: (0, get_weights_1.coalesce)(stat.forumPostsReadCountPercentile),
                            weight: (0, get_weights_1.coalesce)(forum.forumPostsReadCountPercentile, 1),
                            op: "+",
                        },
                    ],
                },
                {
                    label: "Total Weights",
                    value: (0, get_weights_1.getTotalWeight)(forum),
                    weight: 1,
                    op: "/",
                },
            ];
        return [
            {
                label: "Percent Multiplier",
                value: 100,
                weight: 1,
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
                        value: (0, get_weights_1.coalesce)(stat.discordMessagePercentile),
                        weight: (0, get_weights_1.coalesce)(score.discordMessagePercentile, 1),
                        op: "+",
                    },
                ],
            },
            {
                label: "Total Weights",
                value: (0, get_weights_1.getTotalWeight)(score),
                weight: 1,
                op: "/",
            },
        ];
    }
}
exports.DefaultDaoPercentileScoreProvider = DefaultDaoPercentileScoreProvider;
