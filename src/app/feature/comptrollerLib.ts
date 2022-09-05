import client from "../../apollo-client";
import { ethers } from "ethers";
import ComptrollerLib from "../../abis/ocf/ComptrollerLib.json";
import { nodeProvider } from "../../app/feature/basic";
import { gql } from "@apollo/client";

export async function getVaultData() {
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

}