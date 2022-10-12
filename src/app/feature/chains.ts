import { Chain } from "wagmi";

export declare const chainId: {
  readonly fuji: 43113;
  readonly avalancheC: 43114;
};
export declare type ChainName = keyof typeof chainId;
export declare const avalancheC: Chain;
export declare const fuji: Chain;

/**
 * Common chains for convenience
 * Should not contain all possible chains
 */
export declare const chain: {
  readonly fuji: Chain;
  readonly avalancheC: Chain;
};
export declare const allChains: Chain[];
export declare const defaultChains: Chain[];
export declare const defaultL2Chains: Chain[];
