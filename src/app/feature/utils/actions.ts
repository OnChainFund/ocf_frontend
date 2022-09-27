import type { BytesLike } from "ethers";

import { encodeArgs } from "./encoding";

export function callOnIntegrationArgs({
  adapter,
  selector,
  encodedCallArgs,
}: {
  adapter: string;
  selector: BytesLike;
  encodedCallArgs: BytesLike;
}) {
  return encodeArgs(
    ["address", "bytes4", "bytes"],
    [adapter, selector, encodedCallArgs]
  );
}
