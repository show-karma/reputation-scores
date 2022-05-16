"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexcoopDaoScoreProvider = void 0;
const default_dao_score_provider_1 = require("./default-dao-score.provider");
class IndexcoopDaoScoreProvider extends default_dao_score_provider_1.DefaultDaoScoreProvider {
    getKarmaScore(stat) {
        return (Math.round((stat.onChainVotesPct || 0) * 5 + (stat.offChainVotesPct || 0) * 3) || 0);
    }
}
exports.IndexcoopDaoScoreProvider = IndexcoopDaoScoreProvider;
