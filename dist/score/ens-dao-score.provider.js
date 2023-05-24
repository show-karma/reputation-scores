"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsDaoScoreProvider = void 0;
const get_weights_1 = require("../util/get-weights");
const default_dao_score_provider_1 = require("./default-dao-score.provider");
class EnsDaoScoreProvider extends default_dao_score_provider_1.DefaultDaoScoreProvider {
    getForumScore(stat) {
        const { forumScore: { lifetime = {} }, } = this.weights;
        const totalWeight = (0, get_weights_1.getTotalWeight)(lifetime);
        return Math.round((((0, get_weights_1.coalesce)(stat.proposalsInitiatedPercentile, 0) *
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
            "offChainVotesPct",
            "onChainVotesPct",
            "delegatedVotes",
            "discordMessagesCount",
        ];
    }
}
exports.EnsDaoScoreProvider = EnsDaoScoreProvider;
