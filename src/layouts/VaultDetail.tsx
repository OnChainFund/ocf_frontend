import { ReactNode } from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ConnectToMetaMask } from "../components/buttons/ConnectToMetaMask";
const Links = ["Dashboard", "Projects", "Team"];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tabs>
        <TabList>
          <Tab>
            <Link href="#">Chakra UI</Link>
          </Tab>
          <Tab>Two</Tab>
          <Tab>Three</Tab>
        </TabList>
      </Tabs>
    </>
  );
}
