"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitcoinDaoScoreProvider = void 0;
const default_dao_score_provider_1 = require("./default-dao-score.provider");
class GitcoinDaoScoreProvider extends default_dao_score_provider_1.DefaultDaoScoreProvider {
    getKarmaScore(stat) {
        return (Math.round(stat.forumActivityScore +
            (stat.offChainVotesPct || 0) +
            (stat.discordMessagePercentile || 0) * 0.01) || 0);
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
    getKarmaScoreProps() {
        return ["forumActivityScore", "offChainVotesPct", "discordMessagesCount"];
    }
}
exports.GitcoinDaoScoreProvider = GitcoinDaoScoreProvider;
