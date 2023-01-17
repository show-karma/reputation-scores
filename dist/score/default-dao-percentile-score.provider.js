"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDaoPercentileScoreProvider = void 0;
const interfaces_1 = require("./interfaces");
class DefaultDaoPercentileScoreProvider extends interfaces_1.BaseProvider {
    getScoreBreakdownCalc(stat, period) {
        throw new Error("Method not implemented.");
    }
    preload(resourceName) {
        throw new Error("Method not implemented.");
    }
    // max here 100 + 20 + 10 + 30 + 5 + 1 = 166
    getForumScore(stat) {
        return Math.round((stat.proposalsInitiatedPercentile * 1 +
            stat.proposalsDiscussedPercentile * 0.2 +
            stat.forumPostCountPercentile * 0.1 +
            stat.forumTopicCountPercentile * 0.3 +
            stat.forumLikesReceivedPercentile * 0.05 +
            stat.forumPostsReadCountPercentile * 0.01) / 166 * 100) || 0;
    }
    // max here 100 + 300 + 500 + 1 = 901
    getKarmaScore(stat, median) {
        return Math.round((stat.forumActivityScore +
            (stat.offChainVotesPct || 0) * 3 +
            (stat.onChainVotesPct || 0) * 5 +
            (stat.discordMessagePercentile || 0) * 0.01) / 901 * 100) || 0;
    }
    getKarmaScoreProps() {
        return [
            "forumActivityScore",
            "offChainVotesPct",
            "onChainVotesPct",
            "discordMessagePercentile",
        ];
    }
}
exports.DefaultDaoPercentileScoreProvider = DefaultDaoPercentileScoreProvider;
