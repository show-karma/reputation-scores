import { AdditionalScoreProvider, DelegateStat, DelegateStatPeriod, ScoreBreakdownCalc } from "./interfaces";
export declare class GitcoinHealthScoreProvider implements AdditionalScoreProvider {
    private githubData;
    private weights;
    preload(): Promise<void>;
    isPublicAddressEligible(publicAddress: string): Promise<boolean>;
    getScore(publicAddress: string, stat: Partial<DelegateStat>): Promise<number>;
    private getLifetimeScore;
    private get180dScore;
    private get30dScore;
    private getWorkstreamInvolvement;
    private getStewardDays;
    private getKarmaData;
    getDefaultBreakdown(stat: Partial<DelegateStat>, weights: Record<string, number>, workstreamScore?: number): ScoreBreakdownCalc;
    getScoreBreakdownCalc(publicAddress: string, stat: Partial<DelegateStat>, period?: DelegateStatPeriod, type?: "forum" | "score"): ScoreBreakdownCalc;
}
