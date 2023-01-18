"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitcoinDaoPercentileScoreProvider = void 0;
const get_weights_1 = require("../util/get-weights");
const default_dao_score_provider_1 = require("./default-dao-score.provider");
class GitcoinDaoPercentileScoreProvider extends default_dao_score_provider_1.DefaultDaoScoreProvider {
    // 200 is max karma score
    getKarmaScore(stat) {
        return Math.round(((stat.forumActivityScore + (stat.offChainVotesPct || 0) || 0) / 200) *
            100);
    }
    // 1660 sum of all forum props percentiles
    getForumScore(stat) {
        return (Math.round((((stat.proposalsInitiatedPercentile || 0) * 10 +
            (stat.proposalsDiscussedPercentile || 0) * 2 +
            (stat.forumPostCountPercentile || 0) +
            (stat.forumTopicCountPercentile || 0) * 3 +
            (stat.forumLikesReceivedPercentile || 0) * 0.5 +
            (stat.forumPostsReadCountPercentile || 0) * 0.1) *
            100) /
            1660) || 0);
    }
    getScoreBreakdownCalc(stat, period, type = "score") {
        const { score: { lifetime: score = {} }, forumScore: { lifetime: forum = {} }, } = this.weights;
        // (100 * (children)) / 1660
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
                    // sum all weights * 100 to get total pct divisor
                    value: ((0, get_weights_1.coalesce)(forum.proposalsDiscussedPercentile, 1) +
                        (0, get_weights_1.coalesce)(forum.proposalsInitiatedPercentile, 1) +
                        (0, get_weights_1.coalesce)(forum.forumPostCountPercentile, 1) +
                        (0, get_weights_1.coalesce)(forum.forumTopicCountPercentile, 1) +
                        (0, get_weights_1.coalesce)(forum.forumLikesReceivedPercentile, 1) +
                        (0, get_weights_1.coalesce)(forum.forumPostsReadCountPercentile, 1)) *
                        100,
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
                ],
            },
            {
                label: "Total Weights",
                value: ((0, get_weights_1.coalesce)(score.forumActivityScore, 1) +
                    (0, get_weights_1.coalesce)(score.offChainVotesPct, 1)) *
                    100,
                weight: 1,
                op: "/",
            },
        ];
    }
}
exports.GitcoinDaoPercentileScoreProvider = GitcoinDaoPercentileScoreProvider;
