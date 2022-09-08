import { nodeProvider } from "app/feature/basic";

async function timestampToBlockNumber() {
    const blockNumber = await nodeProvider.getBlock(100004);
    return blockNumber;
}

console.log(timestampToBlockNumber());