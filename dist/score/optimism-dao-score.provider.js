"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimismDaoScoreProvider = void 0;
const interfaces_1 = require("./interfaces");
class OptimismDaoScoreProvider extends interfaces_1.BaseProvider {
    preload(daoName) {
        throw new Error("Method not implemented.");
    }
    getForumScore(stat) {
        return (Math.round(stat.proposalsInitiated * 10 +
            stat.proposalsDiscussed * 2 +
            stat.forumPostCount +
            stat.forumTopicCount * 3 +
            stat.forumLikesReceived * 0.5 +
            stat.forumPostsReadCount * 0.1) || 0);
    }
    getKarmaScore(stat, median) {
        return Math.round(stat.delegatedVotes / 10000 + stat.offChainVotesPct * 2);
    }
    getKarmaScoreProps() {
        return ["delegatedVotes", "offChainVotesPct"];
    }
}
exports.OptimismDaoScoreProvider = OptimismDaoScoreProvider;
