import { utils } from "ethers";
import { sighash } from "./sighash";
export const takeOrderFragment = utils.FunctionFragment.fromString(
  "takeOrder(address,bytes,bytes)"
);
export const takeOrderSelector = sighash(takeOrderFragment);
