// src/components/VaultLayout.tsx
import React, { ReactNode } from "react";
import { Center, Container, useColorModeValue, Flex } from "@chakra-ui/react";
import NavBar from "./NavBar";
import SimpleSidebar from "./Sidebar";
import VaultDetail from "./VaultDetail";

type Props = {
  children: ReactNode;
};

export function VaultLayout(props: Props) {
  return (
    <div>
      <NavBar />
      <Flex>
        <SimpleSidebar>
          <></>
        </SimpleSidebar>

        <Container maxW="container.lg" py="5">
          <VaultDetail />
          {props.children}
        </Container>
        <Center
          as="footer"
          bg={useColorModeValue("gray.100", "gray.700")}
          p={6}
        ></Center>
      </Flex>
    </div>
  );
}
