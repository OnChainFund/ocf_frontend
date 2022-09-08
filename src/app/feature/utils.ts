import { nodeProvider } from "./basic";

export async function timestampToBlockNumber(timeAgo: number): Promise<number> {
  const latestBlockNumber = await nodeProvider.getBlockNumber();
  const guess = latestBlockNumber - Math.floor(timeAgo / 2.775);
  return guess;
}
