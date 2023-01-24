"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimismDaoScoreProvider = void 0;
const get_weights_1 = require("../util/get-weights");
const interfaces_1 = require("./interfaces");
class OptimismDaoScoreProvider extends interfaces_1.BaseProvider {
    async preload() {
        this.weights = await (0, get_weights_1.getWeights)("optimism");
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
        return Math.round(stat.delegatedVotes / 10000 + stat.offChainVotesPct * 2);
    }
    getKarmaScoreProps() {
        return ["delegatedVotes", "offChainVotesPct"];
    }
    getScoreBreakdownCalc(stat, period, type = "score") {
        const { score: { lifetime = {} }, forumScore: { lifetime: forum = {} }, } = this.weights;
        if (type === "forum")
            return [
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
            ];
        return [
            {
                label: "Delegated Votes",
                value: (0, get_weights_1.coalesce)(stat.delegatedVotes),
                weight: (0, get_weights_1.coalesce)(lifetime.delegatedVotes),
            },
            {
                label: "Off chain votes %",
                value: (0, get_weights_1.coalesce)(stat.offChainVotesPct),
                weight: (0, get_weights_1.coalesce)(lifetime.offChainVotesPct),
                op: "+",
            },
        ];
    }
}
exports.OptimismDaoScoreProvider = OptimismDaoScoreProvider;
