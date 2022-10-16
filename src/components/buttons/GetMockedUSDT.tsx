import { Button, useToast, UseToastOptions } from "@chakra-ui/react";
import React from "react";
import { useAccount } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { Addresses } from "abis/ocf/Address";
import { ERC20ABI } from "abis/ERC20ABI";
import { nodeProvider } from "app/feature/utils/basic";

export function GetMockedUSDT() {
  const toast = useToast();
  const toastIdRef = React.useRef();
  const { address, isConnected } = useAccount();
  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }
  function addToast(status: UseToastOptions["status"], description: string) {
    toastIdRef.current = toast({
      status: status,
      description: description,
      position: "bottom-right",
    }) as undefined;
  }

  async function sendUSD(address: string) {
    const erc20 = new ethers.Contract(Addresses.USDT, ERC20ABI, nodeProvider);
    const user: ethers.Wallet = new ethers.Wallet(
      "baa235a9bb3244ee5b34c251a7a1fe3a4a65ace8aa22e33a443152f81015f714",
      nodeProvider
    );
    addToast("loading", "Sending Your 100 USDT...");
    const tx = await erc20
      .connect(user)
      .transfer(address, BigNumber.from(BigInt(1e20)));
    await tx;
    close();
    addToast("success", "Complete! Enjoy your trading");
  }
  if (!isConnected) {
    return (
      <>
        <Button disabled={true}>Get Test USDT</Button>
      </>
    );
  }
  return (
    <>
      <Button
        onClick={() => {
          sendUSD(address);
        }}
      >
        Get Test USDT
      </Button>
    </>
  );
}
