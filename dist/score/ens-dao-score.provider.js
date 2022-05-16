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
        return (Math.round(stat.forumActivityScore +
            (stat.offChainVotesPct || 0) * 3 +
            (stat.delegatedVotes > median ? 20 : 0)) || 0);
    }
}
exports.EnsDaoScoreProvider = EnsDaoScoreProvider;
