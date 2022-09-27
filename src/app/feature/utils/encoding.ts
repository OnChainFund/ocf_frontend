import { resolveArguments } from "./resolveArguments";
import { ethers, utils } from "ethers";

import { sighash } from "./sighash";

export function encodeArgs(types: (utils.ParamType | string)[], args: any[]) {
  const params = types.map((type) => utils.ParamType.from(type));
  const resolved = resolveArguments(params, args);
  const hex = utils.defaultAbiCoder.encode(params, resolved);

  return utils.hexlify(utils.arrayify(hex));
}

export function encodeFunctionData(
  fragment: utils.FunctionFragment,
  args: any[] = []
) {
  const encodedArgs = encodeArgs(fragment.inputs, args);
  return utils.hexlify(utils.concat([sighash(fragment), encodedArgs]));
}

//export async function encodeWithSelector(
//  fragment: utils.FunctionFragment,
//  args: any[] = []
//) {
//  const encodedArgs = encodeArgs(fragment.inputs, args);
//  const nft = (await (
//    await ethers.getContractFactory("ERC721")
//  ).deploy()) as TypeERC721;
//  nft.contract.interface.encodeFunctionData("approve", ["0xADDR", 333]);
//  return utils.hexlify(utils.concat([sighash(fragment), encodedArgs]));
//}
