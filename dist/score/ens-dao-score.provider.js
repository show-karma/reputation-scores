"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsDaoScoreProvider = void 0;
const get_weights_1 = require("src/util/get-weights");
const default_dao_score_provider_1 = require("./default-dao-score.provider");
class EnsDaoScoreProvider extends default_dao_score_provider_1.DefaultDaoScoreProvider {
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
        return (Math.round(stat.forumActivityScore ||
            0 * (0, get_weights_1.coalesce)(lifetime.forumActivityScore, 1) +
                (stat.offChainVotesPct || 0) *
                    (0, get_weights_1.coalesce)(lifetime.offChainVotesPct, 1) +
                (stat.onChainVotesPct || 0) *
                    (0, get_weights_1.coalesce)(lifetime.onChainVotesPct, 1) +
                (stat.discordMessagesCount || 0) *
                    (0, get_weights_1.coalesce)(lifetime.discordMessagesCount, 1)) || 0);
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
