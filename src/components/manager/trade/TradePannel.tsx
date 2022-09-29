import { Box, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { Addresses } from "abis/ocf/Address";
import {
  IntegrationManagerActionId,
  pangolinTakeOrderArgs,
} from "app/feature/pangolin";
import { takeOrderSelector } from "app/feature/utils/common";
import { SendTransactionButton } from "components/buttons/SendTransactionButton";
import { useState } from "react";
import { callOnIntegrationArgs } from "app/feature/utils/actions";
import { default as ERC20ABI } from "abis/ERC20.json";
import AmountInputBox from "./AmountInputBox";
import { useAccount, useContractReads } from "wagmi";
import { formatUnits } from "ethers/lib/utils";
import { Asset } from "types/asset";
import { Assets } from "pages/api/mocks/assets";
import { ReadContract } from "types/contract";
import ERC20BalanceInterface from "../../../abis/newFormat/ERC20/balance.json";
interface Prop {
  comptrollerProxyAddress: string;
  vaultProxyAddress: string;
}

export default function TradePannel(props: Prop) {
  const { address, isConnected } = useAccount();
  const [fromAsset, setFromAsset] = useState(Assets[0]);
  const [toAsset, setToAsset] = useState(Assets[2]);
  const [inputAmount, setInputAmount] = useState("1.0");
  const [outputAmount, setOutputAmount] = useState("1.0");

  let contracts: ReadContract[] = [];
  for (let index = 0; index < Assets.length; index++) {
    contracts.push({
      addressOrName: Assets[index].address,
      contractInterface: [ERC20BalanceInterface],
      functionName: "balanceOf",
      args: [props.vaultProxyAddress],
    });
  }
  const { data, isError, isLoading } = useContractReads({
    contracts: contracts,
    allowFailure: false,
  });

  if (!isConnected || isError || isLoading) {
    return <Text fontSize="2xl"> Not Connected </Text>;
  }
  const takeOrderArgs = pangolinTakeOrderArgs({
    minIncomingAssetAmount: Number(inputAmount),
    outgoingAssetAmount: Number(outputAmount),
    path: [fromAsset.address, toAsset.address],
  });

  const callArgs = callOnIntegrationArgs({
    adapter: Addresses.ocf.PangolinExchangeAdapter,
    encodedCallArgs: takeOrderArgs,
    selector: takeOrderSelector,
  });
  let assets = [];
  for (let index = 0; index < data.length; index++) {
    assets.push({
      title: Assets[index].title,
      address: Assets[index].address,
      balance: formatUnits(data[index], 18),
    });
  }
  return (
    <>
      <Box>
        <SimpleGrid columns={1} spacing={10}>
          <Box p={3}>
            <Text fontSize="2xl"> Trade </Text>
          </Box>
          <Box>
            <AmountInputBox
              assets={assets}
              asset={fromAsset}
              setAsset={setFromAsset}
              amount={inputAmount}
              setAmount={setInputAmount}
            />

            <AmountInputBox
              assets={assets}
              asset={toAsset}
              setAsset={setToAsset}
              amount={outputAmount}
              setAmount={setOutputAmount}
            />
          </Box>

          <Spacer />

          <SendTransactionButton
            buttonTitle={"Confirm"}
            contractAddress={props.comptrollerProxyAddress}
            contractInterface={[
              {
                inputs: [
                  {
                    internalType: "address",
                    name: "_extension",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "_actionId",
                    type: "uint256",
                  },
                  {
                    internalType: "bytes",
                    name: "_callArgs",
                    type: "bytes",
                  },
                ],
                name: "callOnExtension",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
            ]}
            functionName={"callOnExtension"}
            functionArgs={[
              Addresses.ocf.IntegrationManager,
              IntegrationManagerActionId.CallOnIntegration,
              callArgs,
            ]}
            functionEnabled={true}
            //notClickable={Number(fromAsset.balance)}
            notClickable={false}
          ></SendTransactionButton>
        </SimpleGrid>
      </Box>
    </>
  );
}
