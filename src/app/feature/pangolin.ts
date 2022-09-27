import type { BigNumberish, Contract, ethers, Wallet } from "ethers";
import { encodeArgs } from "./utils/encoding";
import { callOnIntegrationArgs } from "./utils/actions";
import { takeOrderSelector } from "./utils/common";

export function pangolinTakeOrderArgs({
  path,
  outgoingAssetAmount,
  minIncomingAssetAmount,
}: {
  path: string[];
  outgoingAssetAmount: BigNumberish;
  minIncomingAssetAmount: BigNumberish;
}) {
  return encodeArgs(
    ["address[]", "uint256", "uint256"],
    [path, outgoingAssetAmount, minIncomingAssetAmount]
  );
}

export function PangolinLendArgs({
  tokenA,
  tokenB,
  amountADesired,
  amountBDesired,
  amountAMin,
  amountBMin,
  minPoolTokenAmount,
}: {
  tokenA: string;
  tokenB: string;
  amountADesired: BigNumberish;
  amountBDesired: BigNumberish;
  amountAMin: BigNumberish;
  amountBMin: BigNumberish;
  minPoolTokenAmount: BigNumberish;
}) {
  return encodeArgs(
    ["address[2]", "uint256[2]", "uint256[2]", "uint256"],
    [
      [tokenA, tokenB],
      [amountADesired, amountBDesired],
      [amountAMin, amountBMin],
      minPoolTokenAmount,
    ]
  );
}

export function PangolinRedeemArgs({
  poolTokenAmount,
  tokenA,
  tokenB,
  amountAMin,
  amountBMin,
}: {
  poolTokenAmount: BigNumberish;
  tokenA: string;
  tokenB: string;
  amountAMin: BigNumberish;
  amountBMin: BigNumberish;
}) {
  return encodeArgs(
    ["uint256", "address[2]", "uint256[2]"],
    [poolTokenAmount, [tokenA, tokenB], [amountAMin, amountBMin]]
  );
}

export async function pangolinTakeOrder({
  comptrollerProxy,
  vaultProxy,
  integrationManager,
  fundOwner,
  uniswapV2ExchangeAdapter,
  path,
  outgoingAssetAmount,
  minIncomingAssetAmount,
  seedFund = false,
}: {
  comptrollerProxy: Contract;
  vaultProxy: Contract;
  integrationManager: Contract;
  fundOwner: Wallet;
  uniswapV2ExchangeAdapter: Contract;
  path: Contract[];
  outgoingAssetAmount: BigNumberish;
  minIncomingAssetAmount: BigNumberish;
  seedFund?: boolean;
}) {
  if (seedFund) {
    // Seed the VaultProxy with enough outgoingAsset for the tx
    await path[0].transfer(vaultProxy, outgoingAssetAmount);
  }

  const takeOrderArgs = pangolinTakeOrderArgs({
    minIncomingAssetAmount,
    outgoingAssetAmount,
    path,
  });

  const callArgs = callOnIntegrationArgs({
    adapter: uniswapV2ExchangeAdapter,
    encodedCallArgs: takeOrderArgs,
    selector: takeOrderSelector,
  });
  console.log(integrationManager);
  console.log("==================");

  return comptrollerProxy
    .connect(fundOwner)
    .callOnExtension(
      integrationManager.address,
      IntegrationManagerActionId.CallOnIntegration,
      callArgs,
      {
        gasLimit: 8000000,
        //gasPrice: 20e14,
      }
    );
}

export enum IntegrationManagerActionId {
  CallOnIntegration = "0",
  AddTrackedAssetsToVault = "1",
  RemoveTrackedAssetsFromVault = "2",
}
