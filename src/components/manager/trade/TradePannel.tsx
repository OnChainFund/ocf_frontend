import { Box, Flex, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { Addresses } from "abis/ocf/Address";
import {
  IntegrationManagerActionId,
  pangolinTakeOrderArgs,
} from "app/feature/pangolin";
import { takeOrderSelector } from "app/feature/utils/common";
import { SendTransactionButton } from "components/buttons/SendTransactionButton";
import { useState } from "react";
import { callOnIntegrationArgs } from "app/feature/utils/actions";
import AmountInputBox from "./AmountInputBox";
import { useAccount, useContractReads } from "wagmi";
import { formatUnits } from "ethers/lib/utils";
import { Asset } from "types/asset";
import { Assets } from "pages/api/mocks/assets";
import { ReadContract } from "types/contract";
import ERC20BalanceInterface from "../../../abis/newFormat/ERC20/balance.json";
import { nodeProvider } from "app/feature/utils/basic";
import { ethers } from "ethers";
import PangolinRouterGetAmountsOut from "../../../abis/newFormat/Pangolin/PangolinRouter/getAmountsOut.json";
import { ChartPannel } from "./ChartPannel";
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
    price: 0,
    slippageTolerance: 0.05,
  });
  function tradingPairContainUSDT() {
    return (
      tradingInfo.fromAsset.address === Addresses.USDT ||
      tradingInfo.toAsset.address === Addresses.USDT
    );
  }
  const pangolinRouter = new ethers.Contract(
    Addresses.pangolin.Router,
    [PangolinRouterGetAmountsOut],
    nodeProvider
  );
  const pangolinRouterData = {
    addressOrName: Addresses.pangolin.Router,
    contractInterface: [PangolinRouterGetAmountsOut],
  };
  // 1: Input, 2: Output
  async function resetAmount(type: 1 | 2, value: string) {
    if (typeof tradingInfo.inputAmount === "string") {
      if (type === 1) {
        // USDT 搭配任一幣種
        // 非 USDT 幣種搭配(兩階段 1.換成 USDT 2.換成指定幣種)

        let outputAmount = "0";
        if (Number(value) > 0) {
          // USD 搭配任一幣種
          if (tradingPairContainUSDT()) {
            const amount = await pangolinRouter.getAmountsOut(
              ethers.utils.parseUnits(Number(value).toFixed(2), 18),
              [tradingInfo.fromAsset.address, tradingInfo.toAsset.address]
            );
            outputAmount = (Number(amount[1]) / 1e18).toString();
          } else {
            const amountUSD = await pangolinRouter.getAmountsOut(
              ethers.utils.parseUnits(Number(value).toFixed(2), 18),
              [tradingInfo.fromAsset.address, Addresses.USDT]
            );
            const amountOutPutAsset = await pangolinRouter.getAmountsOut(
              amountUSD[1],
              [Addresses.USDT, tradingInfo.toAsset.address]
            );
            outputAmount = (Number(amountOutPutAsset[1]) / 1e18).toString();
          }
        }

        setTradingInfo({
          ...tradingInfo,
          inputAmount: value,
          outputAmount: outputAmount,
          price: Number(outputAmount) / Number(value),
        });
      } else {
        setTradingInfo({ ...tradingInfo, outputAmount: value });
      }
    }
  }
  function switchTradingPair() {
    setTradingInfo({
      ...tradingInfo,
      fromAsset: tradingInfo.toAsset,
      toAsset: tradingInfo.fromAsset,
      inputAmount: tradingInfo.outputAmount,
      outputAmount: tradingInfo.inputAmount,
      price: tradingInfo.price === 0 ? 0 : 1 / tradingInfo.price,
    });
  }
  function resetAsset(type: 1 | 2, asset: Asset) {
    if (type === 1) {
      // 兩個一樣 -> 全部互換
      if (asset.address === tradingInfo.toAsset.address) {
        switchTradingPair();
      } else {
        // 兩個不同
        setTradingInfo({ ...tradingInfo, fromAsset: asset });
      }
    } else {
      if (asset.address === tradingInfo.fromAsset.address) {
        switchTradingPair();
      } else {
        // 兩個不同
        setTradingInfo({ ...tradingInfo, toAsset: asset });
      }
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
  if (tradingPairContainUSDT()) {
    contracts.push({
      ...pangolinRouterData,
      functionName: "getAmountsOut",
      args: [
        1e10,
        [tradingInfo.fromAsset.address, tradingInfo.toAsset.address],
      ],
    });
  } else {
    contracts.push({
      ...pangolinRouterData,
      functionName: "getAmountsOut",
      args: [1e10, [tradingInfo.fromAsset.address, Addresses.USDT]],
    });
    contracts.push({
      ...pangolinRouterData,
      functionName: "getAmountsOut",
      args: [1e10, [Addresses.USDT, tradingInfo.toAsset.address]],
    });
  }
  const { data, isError, isLoading } = useContractReads({
    contracts: [...contracts],
    allowFailure: false,
  });

  if (!isConnected) {
    return <Text fontSize="2xl"> Not Connected </Text>;
  }
  if (isError) {
    return <Text fontSize="2xl"> Error </Text>;
  }
  if (isLoading) {
    return <Text fontSize="2xl"> Loading </Text>;
  }
  const takeOrderArgs = pangolinTakeOrderArgs({
    outgoingAssetAmount: Number(tradingInfo.inputAmount),
    minIncomingAssetAmount:
      Number(tradingInfo.outputAmount) * (1 - tradingInfo.slippageTolerance),
    path: [tradingInfo.fromAsset.address, tradingInfo.toAsset.address],
  });

  const callArgs = callOnIntegrationArgs({
    adapter: Addresses.ocf.PangolinExchangeAdapter,
    encodedCallArgs: takeOrderArgs,
    selector: takeOrderSelector,
  });
  let assets = [];

  const overBalanceError =
    Number(tradingInfo.fromAsset.balance) < Number(tradingInfo.inputAmount);
  //||
  //Number(tradingInfo.toAsset.balance) < Number(tradingInfo.outputAmount);
  console.log(assets);

  return (
    <>
      <Flex>
        <ChartPannel
          assetName={tradingInfo.toAsset.title}
          assetAddress={tradingInfo.toAsset.address}
          price={0}
        />
        <Box>
          <Box
            borderWidth="2px"
            borderRadius="lg"
            w={"100%"}
            //bg={useColorModeValue("gray.300", "gray.900")}
          >
            <Box>
              <SimpleGrid columns={1} spacing={10}>
                <Box p={3}>
                  <Text fontSize="2xl"> Trade </Text>
                </Box>
                <Box>
                  <AmountInputBox
                    assets={Assets}
                    asset={tradingInfo.fromAsset}
                    type={1}
                    amount={tradingInfo.inputAmount}
                    setAsset={resetAsset}
                    setAmount={resetAmount}
                  />
                  <AmountInputBox
                    assets={Assets}
                    asset={tradingInfo.toAsset}
                    type={2}
                    amount={tradingInfo.outputAmount}
                    setAsset={resetAsset}
                    setAmount={resetAmount}
                  />
                </Box>
                <Box w={"100%"} p={2}>
                  <Flex>
                    <Text>Price:</Text>
                    <Spacer />
                    <Text>
                      {tradingInfo.price.toFixed(2)} :{" "}
                      {tradingInfo.toAsset.title}/{tradingInfo.fromAsset.title}
                    </Text>
                  </Flex>
                </Box>
                <Box w={"100%"} p={2}>
                  <Flex>
                    <Text>Slippage Tolerance:</Text>
                    <Spacer />
                    <Text>{tradingInfo.slippageTolerance * 100}%</Text>
                  </Flex>
                </Box>

                <Spacer />

                <SendTransactionButton
                  afterClick={() => {}}
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
          </Box>
        </Box>
      </Flex>
    </>
  );
}
