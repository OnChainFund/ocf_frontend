import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/layout";
import { Button, Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import { selectAccountState, setAccountState } from "../../store/accountSlice";
import { useDispatch, useSelector } from "react-redux";
declare let window: any;
export const ConnectToMetaMask = () => {
  const AccountState = useSelector(selectAccountState);
  const dispatch = useDispatch();
  //
  const [chainId, setChainId] = useState<number | undefined>();
  //
  const [balance, setBalance] = useState<string | undefined>();

  function isFuji(chainId: number | undefined) {
    return chainId === 43113;
  }

  useEffect(() => {
    if (!AccountState || !ethers.utils.isAddress(AccountState)) return;
    //client side code
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.getBalance(AccountState).then((result) => {
      setBalance(ethers.utils.formatEther(result));
    });
    provider.getNetwork().then((result) => {
      setChainId(result.chainId);
    });
  }, [AccountState]);

  const onClickDisconnect = () => {
    //console.log("onClickDisConnect");
    setBalance(undefined);
    dispatch(setAccountState("0x0000000000000000000000000000000000000000"));
  };

  const onClickConnect = () => {
    //client side code
    if (!window.ethereum) {
      //console.log("please install MetaMask");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) dispatch(setAccountState(accounts[0]));
      })
      .catch((e) => console.log(e));
  };
  function truncate(str: String, max: any, suffix: String): string {
    return str.substring(0, max) + suffix;
  }
  return (
    <Box w="100%">
      {AccountState != "0x0000000000000000000000000000000000000000" ? (
        <Flex gap={3}>
          <Button w="40%">
            {isFuji(chainId) ? "Avalanche Fuji" : "Wrong Network"}
          </Button>
          <Button type="button" w="60%" onClick={onClickDisconnect}>
            {truncate(AccountState, 10, "...")}
          </Button>
        </Flex>
      ) : (
        <Flex gap={3}>
          <Button w="40%">Not Connected</Button>
          <Button type="button" w="60%" onClick={onClickConnect}>
            Connect MetaMask
          </Button>
        </Flex>
      )}
    </Box>
  );
};
