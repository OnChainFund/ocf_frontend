import { Box, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { Addresses } from "abis/ocf/Address";
import {
  IntegrationManagerActionId,
  pangolinTakeOrderArgs,
} from "app/feature/pangolin";
import { takeOrderSelector } from "app/feature/utils/common";
import { SendTransactionButton } from "components/buttons/SendTransactionButton";
import { useEffect, useState } from "react";
import { callOnIntegrationArgs } from "app/feature/utils/actions";
import { default as ERC20ABI } from "abis/ERC20.json";
import AmountInputBox from "./AmountInputBox";
import { useAccount, useContractReads } from "wagmi";
import { formatUnits } from "ethers/lib/utils";
import { Asset } from "types/asset";
import { Assets } from "pages/api/mocks/assets";
import { ReadContract } from "types/contract";
import ERC20BalanceInterface from "../../../abis/newFormat/ERC20/balance.json";
import { nodeProvider } from "app/feature/utils/basic";
import abi from "ethcall/lib/abi";
import { ethers } from "ethers";
import PangolinRouterGetAmountsIn from "../../../abis/newFormat/Pangolin/PangolinRouter/getAmountsIn.json";
import PangolinRouterGetAmountsOut from "../../../abis/newFormat/Pangolin/PangolinRouter/getAmountsOut.json";
interface Prop {
  comptrollerProxyAddress: string;
  vaultProxyAddress: string;
}

export default function TradePannel(props: Prop) {
  const { address, isConnected } = useAccount();
  const [tradingInfo, setTradingInfo] = useState({
    fromAsset: Assets[0],
    toAsset: Assets[2],
    inputAmount: "0",
    outputAmount: "0",
  });
  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
  }, [tradingInfo]);
  // 1: Input, 2: Output
  async function resetAmount(type: 1 | 2, value: string) {
    let amount: any;
    if (typeof tradingInfo.inputAmount === "string") {
      if (type === 1) {
        if (
          tradingInfo.fromAsset.address === Addresses.USDT ||
          tradingInfo.toAsset.address === Addresses.USDT
        ) {
          const pangolinRouter = new ethers.Contract(
            Addresses.pangolin.Router,
            [PangolinRouterGetAmountsOut],
            nodeProvider
          );
          console.log(Number(tradingInfo.inputAmount));
          console.log(typeof tradingInfo.inputAmount);
          if (Number(tradingInfo.inputAmount) !== 0) {
            amount = await pangolinRouter.getAmountsOut(
              ethers.utils.parseUnits(
                Number(tradingInfo.inputAmount).toFixed(2),
                18
              ),
              [tradingInfo.fromAsset.address, tradingInfo.toAsset.address]
            );
            console.log(amount);
            console.log(Number(amount[0]) / 1e18);
            console.log(Number(amount[1]) / 1e18);
          }
        }
        //setTradingInfo({
        //  ...tradingInfo,
        //  inputAmount: value,
        //  outputAmount: Number(amount[1]).toString(),
        //});
        setTradingInfo({
          ...tradingInfo,
          inputAmount: value,
          outputAmount: (Number(amount[1]) / 1e18).toString(),
        });
      } else {
        setTradingInfo({ ...tradingInfo, outputAmount: value });
      }
    }
  }

  function resetAsset(type: 1 | 2, asset: Asset) {
    if (type === 1) {
      setTradingInfo({ ...tradingInfo, fromAsset: asset });
    } else {
      setTradingInfo({ ...tradingInfo, toAsset: asset });
    }
  }

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
    minIncomingAssetAmount: Number(tradingInfo.inputAmount),
    outgoingAssetAmount: Number(tradingInfo.outputAmount),
    path: [tradingInfo.fromAsset.address, tradingInfo.toAsset.address],
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

  const overBalanceError =
    Number(tradingInfo.fromAsset.balance) < Number(tradingInfo.inputAmount);
  //||
  //Number(tradingInfo.toAsset.balance) < Number(tradingInfo.outputAmount);
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
              asset={tradingInfo.fromAsset}
              test={tradingInfo}
              type={1}
              amount={tradingInfo.inputAmount}
              setAsset={resetAsset}
              setAmount={resetAmount}
            />

            <AmountInputBox
              assets={assets}
              test={tradingInfo}
              asset={tradingInfo.toAsset}
              type={2}
              amount={tradingInfo.outputAmount}
              setAsset={resetAsset}
              setAmount={resetAmount}
            />
          </Box>

          <Spacer />

          <SendTransactionButton
            buttonTitle={overBalanceError ? "Over Balance" : "Confirm"}
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
            notClickable={overBalanceError}
          ></SendTransactionButton>
        </SimpleGrid>
      </Box>
    </>
  );
}
