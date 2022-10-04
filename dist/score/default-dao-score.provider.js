"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDaoScoreProvider = void 0;
const interfaces_1 = require("./interfaces");
class DefaultDaoScoreProvider extends interfaces_1.BaseProvider {
    getForumScore(stat) {
        return (Math.round(stat.proposalsInitiated * 1 +
            stat.proposalsDiscussed * 0.2 +
            stat.forumPostCount * 0.1 +
            stat.forumTopicCount * 0.3 +
            stat.forumLikesReceived * 0.05 +
            stat.forumPostsReadCount * 0.01) || 0);
    }
    getKarmaScore(stat, median) {
        return (Math.round(stat.forumActivityScore +
            (stat.offChainVotesPct || 0) * 3 +
            (stat.onChainVotesPct || 0) * 5 +
            (stat.discordMessagesCount || 0) * 0.01) || 0);
    }
    getKarmaScoreProps() {
        return [
            "forumActivityScore",
            "offChainVotesPct",
            "onChainVotesPct",
            "discordMessagesCount",
        ];
    }
}
exports.DefaultDaoScoreProvider = DefaultDaoScoreProvider;
