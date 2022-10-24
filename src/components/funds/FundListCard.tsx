import {
  Box,
  chakra,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { BsPerson } from "react-icons/bs";
import { AiFillFund } from "react-icons/ai";
import { FaMoneyBillAlt } from "react-icons/fa";
import { StatsCard } from "../cards/StatsCard";
interface FundListCardProps {
  fundCount: number;
  depositorCount: number;
  AUMSum: number;
}
export default function FundListCard(props: FundListCardProps) {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        textAlign={"center"}
        fontSize={"4xl"}
        py={10}
        fontWeight={"bold"}
      >
        The Most Diversify AI Crypto Fund Platfrom
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title={"Assets"}
          stat={String(props.depositorCount)}
          icon={<BsPerson size={"3em"} />}
        />
        <StatsCard
          title={"Assets Under Management"}
          stat={"$" + String(props.AUMSum.toFixed(2))}
          icon={<FaMoneyBillAlt size={"3em"} />}
        />
        <StatsCard
          title={"Funds"}
          stat={String(props.fundCount)}
          icon={<AiFillFund size={"3em"} />}
        />
      </SimpleGrid>
    </Box>
  );
}
