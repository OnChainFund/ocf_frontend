import { ChakraProvider } from "@chakra-ui/react";
import { Store } from "@reduxjs/toolkit";

const Providers: React.FC<
  React.PropsWithChildren<{ children: React.ReactNode }>
> = ({ children }) => {
  return (
    <>
      <ChakraProvider>{children}</ChakraProvider>
    </>
  );
};

export default Providers;
