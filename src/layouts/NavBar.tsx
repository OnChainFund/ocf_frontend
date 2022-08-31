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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ConnectToMetaMask } from "../components/buttons/ConnectToMetaMask";
type LinkBarItem = {
  name: string;
  link: string;
};
const Links: LinkBarItem[] = [
  //  { name: "dashboard", link: "" },
  { name: "Home", link: "/" },
  { name: "Vault", link: "/vault" },
  { name: "Manager", link: "/manager" },
  { name: "Docs", link: "https://onchainfund.github.io/doc/" },
];

interface NavLinkProps {
  title: string;
  link: string;
}
function NavLink(props: NavLinkProps) {
  const { title, link } = props;
  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={link}
    >
      {title}
    </Link>
  );
}

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  function titleCaseWord(word: string) {
    if (!word) return word;
    let modified = (" " + word).slice(1);
    return modified[0].toUpperCase() + modified.substr(1).toLowerCase();
  }
  return (
    <>
      <Box bg={useColorModeValue("gray.300", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((item) => (
                <NavLink key={item.name} title={item.name} link={item.link} />
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"} w="30%">
            <ConnectToMetaMask />
          </Flex>
        </Flex>

        {isOpen ? <Box pb={4} display={{ md: "none" }}></Box> : null}
      </Box>
    </>
  );
}
