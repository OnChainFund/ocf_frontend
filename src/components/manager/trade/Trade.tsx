import { useColorModeValue, Box, Flex, Text } from "@chakra-ui/react";
import { SimpleChart } from "components/chart/SimpleChart";
import TradePannel from "./TradePannel";

interface Props {}
export default function Trade(props: Props) {
  const initialData = [
    { time: "2018-12-22", value: 32.51 },
    { time: "2018-12-23", value: 31.11 },
    { time: "2018-12-24", value: 27.02 },
    { time: "2018-12-25", value: 27.32 },
    { time: "2018-12-26", value: 25.17 },
    { time: "2018-12-27", value: 28.89 },
    { time: "2018-12-28", value: 25.46 },
    { time: "2018-12-29", value: 23.92 },
    { time: "2018-12-30", value: 22.68 },
    { time: "2018-12-31", value: 22.67 },
  ];
  return (
    <>
      <Flex>
        <Box borderWidth="2px" borderRadius="lg" mr={10}>
          <Box pl={5} p={5}>
            <Text> USDT/TSLA </Text>
            <Text fontSize="3xl"> 1713.8 </Text>
          </Box>
          <Box p={5}>
            {" "}
            <SimpleChart
              data={initialData}
              colors={{
                backgroundColor: "white",
                lineColor: "#2962FF",
                textColor: "black",
                areaTopColor: "#2962FF",
                areaBottomColor: "rgba(41, 98, 255, 0.28)",
              }}
            />
          </Box>
        </Box>
        <Box
          borderWidth="2px"
          borderRadius="lg"
          w={"100%"}
          //bg={useColorModeValue("gray.300", "gray.900")}
        >
          <Box pl={5} p={5}>
            <TradePannel />
          </Box>
        </Box>
      </Flex>
    </>
  );
}
