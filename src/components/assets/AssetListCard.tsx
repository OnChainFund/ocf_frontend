import { Box, chakra, SimpleGrid } from "@chakra-ui/react";
import { AiFillFund } from "react-icons/ai";
import { FaMoneyBillAlt } from "react-icons/fa";
import { StatsCard } from "components/cards/StatsCard";
interface AssetListCardProps {
  assetCount: number;
  AUMSum: number;
}
export default function AssetListCard(props: AssetListCardProps) {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        //textAlign={"center"}
        fontSize={"4xl"}
        py={10}
        fontWeight={"bold"}
      >
        The Asstes We Support
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        {/*<StatsCard
          title={"Assets Under Management"}
          stat={"$" + String(props.AUMSum.toFixed(2))}
          icon={<FaMoneyBillAlt size={"3em"} />}
  />*/}
        <StatsCard
          title={"Assets"}
          stat={String(props.assetCount)}
          icon={<FaMoneyBillAlt size={"3em"} />}
        />
      </SimpleGrid>
    </Box>
  );
}
