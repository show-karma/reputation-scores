"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdleDaoScoreProvider = void 0;
const interfaces_1 = require("./interfaces");
class IdleDaoScoreProvider extends interfaces_1.BaseProvider {
  getForumScore(stat) {
    return (
      Math.round(
        stat.proposalsInitiated * 10 +
          stat.proposalsDiscussed * 2 +
          stat.forumPostCount +
          stat.forumTopicCount * 3 +
          stat.forumLikesReceived * 0.5 +
          stat.forumPostsReadCount * 0.1
      ) || 0
    );
  }
  getKarmaScore(stat, median) {
    return (
      Math.round(
        stat.delegatedVotes * 0.0005 +
          (stat.forumActivityScore || 0) +
          (stat.offChainVotesPct || 0) * 3 +
          (stat.discordMessagesCount || 0) * 0.01
      ) || 0
    );
  }
}
exports.IdleDaoScoreProvider = IdleDaoScoreProvider;
