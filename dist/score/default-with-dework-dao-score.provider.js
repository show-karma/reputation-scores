"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultWithDeworkDaoScoreProvider = void 0;
const interfaces_1 = require("./interfaces");
class DefaultWithDeworkDaoScoreProvider extends interfaces_1.BaseProvider {
    getScoreBreakdownCalc(stat, period) {
        return [];
    }
    preload(resourceName) {
        return;
    }
    getForumScore(stat) {
        return (Math.round((stat.proposalsInitiated || 0) * 1 +
            (stat.proposalsDiscussed || 0) * 0.2 +
            (stat.forumPostCount || 0) * 0.1 +
            (stat.forumTopicCount || 0) * 0.3 +
            (stat.forumLikesReceived || 0) * 0.05 +
            (stat.forumPostsReadCount || 0) * 0.01) || 0);
    }
    getKarmaScore(stat, median) {
        return (Math.round((stat.forumActivityScore || 0) +
            (stat.offChainVotesPct || 0) * 3 +
            (stat.onChainVotesPct || 0) * 5 +
            (stat.discordMessagesCount || 0) * 0.01 +
            (stat.deworkPoints || 0) * 0.1) || 0);
    }
    getKarmaScoreProps() {
        return [
            "forumActivityScore",
            "offChainVotesPct",
            "onChainVotesPct",
            "discordMessagesCount",
            "deworkPoints",
        ];
    }
}
exports.DefaultWithDeworkDaoScoreProvider = DefaultWithDeworkDaoScoreProvider;
