"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdleDaoScoreProvider = void 0;
const get_weights_1 = require("src/util/get-weights");
const interfaces_1 = require("./interfaces");
class IdleDaoScoreProvider extends interfaces_1.BaseProvider {
    preload(daoName) {
        throw new Error("Method not implemented.");
    }
    getForumScore(stat) {
        return (Math.round((stat.proposalsInitiated || 0) * 10 +
            (stat.proposalsDiscussed || 0) * 2 +
            (stat.forumPostCount || 0) +
            (stat.forumTopicCount || 0) * 3 +
            (stat.forumLikesReceived || 0) * 0.5 +
            (stat.forumPostsReadCount || 0) * 0.1) || 0);
    }
    getKarmaScore(stat, median) {
        return (Math.round(stat.delegatedVotes * 0.1 +
            (stat.forumActivityScore || 0) +
            (stat.offChainVotesPct || 0) * 3 +
            (stat.onChainVotesPct || 0) * 5 +
            (stat.discordMessagesCount || 0) * 0.01) || 0);
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
                    label: "Forum Topic Count",
                    value: (0, get_weights_1.coalesce)(stat.proposalsInitiated),
                    weight: (0, get_weights_1.coalesce)(forum.proposalsInitiated),
                    op: "+",
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
                label: "Delegated Votes",
                value: (0, get_weights_1.coalesce)(stat.delegatedVotes),
                weight: (0, get_weights_1.coalesce)(score.delegatedVotes, 1),
            },
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
exports.IdleDaoScoreProvider = IdleDaoScoreProvider;
