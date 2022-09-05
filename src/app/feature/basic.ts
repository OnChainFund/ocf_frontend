import { ethers, utils } from "ethers";
export const nodeProvider = new ethers.providers.JsonRpcProvider(
  "https://api.avax-test.network/ext/bc/C/rpc"
);
