import React, { useState } from "react";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ERC20ABI as abi } from "abis/ERC20ABI";
import { Contract } from "ethers";
import {
  TransactionResponse,
  TransactionReceipt,
} from "@ethersproject/abstract-provider";
import { selectAccountState, setAccountState } from "../store/accountSlice";
import { useSelector } from "react-redux";

interface Props {
  addressContract: string;
  currentAccount: string | undefined;
}

declare let window: any;

export default function TransferERC20(props: Props) {
  const AccountState = useSelector(selectAccountState);
  const addressContract = props.addressContract;
  const currentAccount = props.currentAccount;
  const [amount, setAmount] = useState<string>("100");
  const [toAddress, setToAddress] = useState<string>("");

  async function transfer(event: React.FormEvent) {
    event.preventDefault();
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const erc20: Contract = new ethers.Contract(addressContract, abi, signer);

    erc20
      .transfer(toAddress, parseEther(amount))
      .then((tr: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`);
        tr.wait().then((receipt: TransactionReceipt) => {
          console.log("transfer receipt", receipt);
        });
      })
      .catch((e: Error) => console.log(e));
  }

  const handleChange = (value: string) => setAmount(value);
}
