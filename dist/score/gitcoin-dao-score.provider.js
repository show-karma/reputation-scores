"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitcoinDaoScoreProvider = void 0;
const default_dao_score_provider_1 = require("./default-dao-score.provider");
class GitcoinDaoScoreProvider extends default_dao_score_provider_1.DefaultDaoScoreProvider {
    getKarmaScore(stat) {
        return (Math.round(stat.forumActivityScore + (stat.offChainVotesPct || 0)) || 0);
    }
    getForumScore(stat) {
        return (Math.round(stat.proposalsInitiated * 10 +
            stat.proposalsDiscussed * 2 +
            stat.forumPostCount +
            stat.forumTopicCount * 3 +
            stat.forumLikesReceived * 0.5 +
            stat.forumPostsReadCount * 0.1) || 0);
    }
}
exports.GitcoinDaoScoreProvider = GitcoinDaoScoreProvider;
