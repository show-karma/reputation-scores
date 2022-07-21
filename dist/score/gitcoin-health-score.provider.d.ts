import { AdditionalScoreProvider, DelegateStat } from './interfaces';
export declare class GitcoinHealthScoreProvider implements AdditionalScoreProvider {
    private githubData;
    preload(): Promise<void>;
    isPublicAddressEligible(publicAddress: string): Promise<boolean>;
    getScore(publicAddress: string, stat: Partial<DelegateStat>): Promise<number>;
    private getLifetimeScore;
    private get30dScore;
    private getWorkstreamInvolvement;
    private getStewardDays;
    private getKarmaData;
}
