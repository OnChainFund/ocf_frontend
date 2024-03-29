import { Box, Center, chakra, Flex, SimpleGrid, Spacer } from "@chakra-ui/react";
import { BsPerson } from "react-icons/bs";
import { AiFillFund } from "react-icons/ai";
import { FaMoneyBillAlt } from "react-icons/fa";
import { StatsCard } from "components/cards/StatsCard";
import { NewFundButton } from "components/buttons/NewFundButton";
interface VaultListCardProps {
  vaultCount: number;
  depositorCount: number;
  AUMSum: number;
}
export default function ManagerFundListCard(props: VaultListCardProps) {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Flex>
        <chakra.h1
          textAlign={"center"}
          fontSize={"4xl"}
          py={10}
          fontWeight={"bold"}
        >
          Manage Your Funds
        </chakra.h1>
        <Spacer />
        <Center>
          <NewFundButton />
        </Center>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title={"Depositers"}
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
          stat={String(props.vaultCount)}
          icon={<AiFillFund size={"3em"} />}
        />
      </SimpleGrid>
    </Box>
  );
}
