"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsDaoScoreProvider = void 0;
const default_dao_score_provider_1 = require("./default-dao-score.provider");
class EnsDaoScoreProvider extends default_dao_score_provider_1.DefaultDaoScoreProvider {
    getForumScore(stat) {
        return (Math.round(stat.proposalsInitiated * 10 +
            stat.proposalsDiscussed * 2 +
            stat.forumPostCount +
            stat.forumTopicCount * 3 +
            stat.forumLikesReceived * 0.5 +
            stat.forumPostsReadCount * 0.1) || 0);
    }
    getKarmaScore(stat, median) {
        return (Math.round((stat.offChainVotesPct || 0) * 5 +
            (stat.onChainVotesPct || 0) * 2 +
            stat.delegatedVotes / 1000 +
            (stat.discordMessagesCount || 0) * 0.01) || 0);
    }
    getKarmaScoreProps() {
        return [
            "offChainVotesPct",
            "onChainVotesPct",
            "delegatedVotes",
            "discordMessagesCount",
        ];
    }
    getScoreBreakdownCalc(stat, period, type) {
        if (type === "forum")
            return [];
        return [];
    }
}
exports.EnsDaoScoreProvider = EnsDaoScoreProvider;
