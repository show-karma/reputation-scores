"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitcoinDaoPercentileScoreProvider = void 0;
const default_dao_score_provider_1 = require("./default-dao-score.provider");
class GitcoinDaoPercentileScoreProvider extends default_dao_score_provider_1.DefaultDaoScoreProvider {
    // 200 is max karma score
    getKarmaScore(stat) {
        return (Math.round((stat.forumActivityScore +
            (stat.offChainVotesPct || 0)) || 0) / 200 * 100);
    }
    // 1660 sum of all forum props percentiles
    getForumScore(stat) {
        return (Math.round(((stat.proposalsInitiatedPercentile || 0) * 10 +
            (stat.proposalsDiscussedPercentile || 0) * 2 +
            (stat.forumPostCountPercentile || 0) +
            (stat.forumTopicCountPercentile || 0) * 3 +
            (stat.forumLikesReceivedPercentile || 0) * 0.5 +
            (stat.forumPostsReadCountPercentile || 0) * 0.1) * 100 / 1660) || 0);
    }
}
exports.GitcoinDaoPercentileScoreProvider = GitcoinDaoPercentileScoreProvider;
