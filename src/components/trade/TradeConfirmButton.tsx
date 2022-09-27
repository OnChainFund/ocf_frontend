import { Addresses } from "abis/ocf/Address";
import {
  IntegrationManagerActionId,
  pangolinTakeOrderArgs,
} from "app/feature/pangolin";
import { callOnIntegrationArgs } from "app/feature/utils/actions";
import { nodeProvider } from "app/feature/utils/basic";
import { takeOrderSelector } from "app/feature/utils/common";
import { SendTransactionButton } from "components/buttons/SendTransactionButton";
import provider from "ethcall/lib/provider";
import { BigNumber, ethers } from "ethers";
import path from "path";
import callOnExtension from "../../abis/ocfNewFormat/ComptrollerLib/callOnExtension.json";
import { default as ERC20 } from "abis/ERC20.json";
interface Prop {
  fromAsset: string;
  toAsset: string;
  comptrollerProxyAddress: string;
  minIncomingAssetAmount: string;
  outgoingAssetAmount: string;
  functionEnabled: boolean;
}
export default function TradeConfirmButton(props: Prop) {
  //const fromAsset = new ethers.Contract(
  //  props.fromAsset,
  //  ERC20["abi"],
  //  nodeProvider
  //);
  //const toAsset = new ethers.Contract(
  //  props.toAsset,
  //  ERC20["abi"],
  //  nodeProvider
  //);

  const takeOrderArgs = pangolinTakeOrderArgs({
    minIncomingAssetAmount: Number(props.minIncomingAssetAmount) * 1e18,
    outgoingAssetAmount: Number(props.outgoingAssetAmount) * 1e18,
    path: [props.fromAsset, props.toAsset],
  });

  const callArgs = callOnIntegrationArgs({
    adapter: Addresses.ocf.PangolinExchangeAdapter,
    encodedCallArgs: takeOrderArgs,
    selector: takeOrderSelector,
  });
  return (
    <SendTransactionButton
      buttonTitle={"Confirm"}
      contractAddress={props.comptrollerProxyAddress}
      contractInterface={[callOnExtension]}
      functionName={"callOnExtension"}
      functionArgs={[
        Addresses.ocf.IntegrationManager,
        IntegrationManagerActionId.CallOnIntegration,
        callArgs,
      ]}
      functionEnabled={props.functionEnabled}
    ></SendTransactionButton>
  );
}
