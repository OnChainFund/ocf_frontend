import client from "../../apollo-client";
import { ethers } from "ethers";
import ComptrollerLib from "../../abis/ocf/ComptrollerLib.json";
import { nodeProvider } from "./basic";
import { gql } from "@apollo/client";
import { timestampToBlockNumber } from "./utils";
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

export async function getPriceVaryPercentage(
  days: number,
  comptrollerProxy: string
) {
  const time = new Date().getTime();
  const now = Math.floor(time / 1000);
  const blockNumberAgo = timestampToBlockNumber(days * 24 * 3600);
  // get data now
  const contract = new ethers.Contract(
    comptrollerProxy,
    ComptrollerLib["abi"],
    nodeProvider
  );
  const tx1 = await contract.callStatic.calcGav();
  const value_now = ethers.utils.formatEther(tx1);

  // get data before
  const tx = await contract.callStatic.calcGav({
    blockTag: blockNumberAgo,
  });
  const value_before = ethers.utils.formatEther(tx);
  return { value_now, value_before };
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
