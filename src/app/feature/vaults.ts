import client from "../../apollo-client";
import { ethers } from "ethers";
import ComptrollerLib from "../../abis/ocf/ComptrollerLib.json";
import { nodeProvider } from "./basic";
import { gql } from "@apollo/client";
export type VaultType = {
  address: string;
  name: string;
  aum: number;
  thisMonth: number;
  thisWeek: number;
  thisDay: number;
};
async function getVaultData() {
  const { data } = await client.query({
    query: gql`
      query {
        allFunds {
          name
          creator
          vaultProxy
          comptrollerProxy
          denominatedAsset {
            name
            address
          }
        }
      }
    `,
  });
  return data;
}
export async function getAUM(comptrollerProxy: string) {
  const contract = new ethers.Contract(
    comptrollerProxy,
    ComptrollerLib["abi"],
    nodeProvider
  );
  const tx = await contract.callStatic.calcGav();
  return ethers.utils.formatEther(tx);
}

export async function getVaultTableData() {
  const allFunds = await getVaultData();
  const data: VaultType[] = await allFunds["allFunds"].map(async (vault) => ({
    address: vault.comptrollerProxy,
    name: vault.name,
    aum: await getAUM(vault.comptrollerProxy),
    //aum: 1,
    thisMonth: 25.4,
    thisWeek: 10,
    thisDay: -10,
  }));

  return data;
}
