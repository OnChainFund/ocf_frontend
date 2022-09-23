import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useConnect,
  useContract,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import tokenContract from "../../../abis/ERC20.json";

export default function Home() {
  const CONTRACT_ADDRESS = "0xAfCF939f2870fc82920058b147A8ff4db98803a5";

  /* Not working on this build
  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: tokenContract.abi,
  };
  */

  //Mint Function
  const {
    data: mintData,
    write: buy,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: tokenContract["abi"],
    functionName: "mint",
  });

  const mintFreeTokens = async () => {
    await buy({
      args: [
        "0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad",
        ethers.utils.parseEther("2"),
      ],
    });
  };

  useEffect(() => {
    console.log("mintData:", mintData);
    console.log("isMintLoading:", isMintLoading);
    console.log("isMintStarted", isMintStarted);
    console.log("mintError:", mintError);
    console.log("___________");
  }, [mintData, isMintLoading, isMintStarted]);

  return (
    <div className="container flex flex-col  items-center mt-10">
      <div className="flex mb-6">
        <ConnectButton showBalance={false} />
      </div>
      <h3 className="text-5xl font-bold mb-20">{"Billyjitsu's token drop"}</h3>

      <div className="flex flex-col">
        <button
          onClick={mintFreeTokens}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 sm:w-auto"
          disabled={isMintLoading}
        >
          Mint Tokens
        </button>
      </div>
    </div>
  );
}
