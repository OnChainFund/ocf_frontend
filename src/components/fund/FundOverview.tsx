import {
  Image,
  Box,
  Flex,
  Stack,
  Text,
  Button,
  Spacer,
} from "@chakra-ui/react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { VaultChart } from "components/fund/VaultChart";
import { DepositButton } from "components/buttons/DepositButton";
import { WithdrawButton } from "components/buttons/WithdrawButton";
import BasicStatistics from "components/fund/VaultInfo";
import { SimpleChart } from "components/chart/SimpleChart";
import { OverviewChart } from "components/chart/OverviewChart";
import { useState } from "react";

interface Props {
  priceChartData: [];
  name: string;
  description: string;
  aum: number;
  averageMonthlyReturn: number;
  averageMonthlyGrowth: number;
  denominatedAssetName: string;
  comptrollerProxyAddress: string;
  vaultProxyAddress: string;
  denominatedAssetAddress: string;
  depositers: number;
}
export default function FundOverview(props: Props) {
  const [chartType, setChartType] = useState(0);
  // 0: gav, 1: navPerShare
  const basicStaticData = {
    aum: props.aum,
    averageMonthlyReturn: props.averageMonthlyReturn,
    averageMonthlyGrowth: props.averageMonthlyGrowth,
    denominatedAssetName: props.denominatedAssetName,
    denominatedAssetAddress: props.denominatedAssetAddress,
    depositers: props.depositers,
  };
  const priceData = props.priceChartData.map((data) => ({
    time: data.time,
    value: chartType === 1 ? data.gav : data.navPerShare,
  }));
  function changeChartType() {
    setChartType(chartType === 0 ? 1 : 0);
  }
  return (
    <>
      <Box w="100%" h="100%">
        <Box w="100%" h="60%">
          <Flex>
            {" "}
            <Box w="80%">
              <Stack spacing={1} p={5}>
                <Box>
                  <Flex>
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src="https://bit.ly/dan-abramov"
                      alt="Dan Abramov"
                    />
                    <Box ml={5}>
                      <Text fontSize="2xl">{props.name}</Text>
                      <Text fontSize="1xl" color="gray">
                        {props.description}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Stack>
            </Box>
            <Flex w="40%">
              <Box p={5}>
                <DepositButton
                  comptrollerProxyAddress={props.comptrollerProxyAddress}
                  denominatedAssetAddress={props.denominatedAssetAddress}
                  vaultProxyAddress={props.vaultProxyAddress}
                />
              </Box>
              <Box p={5}>
                <WithdrawButton
                  comptrollerProxyAddress={props.comptrollerProxyAddress}
                  denominatedAssetAddress={props.denominatedAssetAddress}
                  vaultProxyAddress={props.vaultProxyAddress}
                />
              </Box>
            </Flex>
          </Flex>

          <Flex>
            <Button m={3} onClick={changeChartType} disabled={chartType === 1}>
              GAV
            </Button>
            <Button m={3} onClick={changeChartType} disabled={chartType === 0}>
              Price Per Share
            </Button>
          </Flex>

          <OverviewChart
            data={priceData}
            colors={{
              backgroundColor: "white",
              lineColor: "#2962FF",
              textColor: "black",
              areaTopColor: "#2962FF",
              areaBottomColor: "rgba(41, 98, 255, 0.28)",
            }}
          />
        </Box>
        <Box w="100%" h="40%" mt={10}>
          <BasicStatistics data={basicStaticData} />
        </Box>
      </Box>
    </>
  );
}
