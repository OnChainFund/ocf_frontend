import { ethers, utils } from "ethers";
import { BigNumber } from "ethers";

export function resolveArguments(
  params: utils.ParamType | utils.ParamType[],
  value: any
): any {
  if (Array.isArray(params)) {
    return params.map((type, index) => {
      const inner = Array.isArray(value) ? value[index] : value[type.name];

      return resolveArguments(type, inner);
    });
  }

  if (params.type === "address") {
    return value;
  }

  if (params.type === "tuple") {
    return resolveArguments(params.components, value);
  }

  if (params.baseType === "array") {
    if (!Array.isArray(value)) {
      throw new Error("Invalid array value");
    }

    return value.map((inner) => {
      return resolveArguments(params.arrayChildren, inner);
    });
  }

  if (params.type.match(/^u?int/)) {
    //return `${BigNumber.from((value * 1e5).toFixed()).mul(
    //  BigNumber.from(10).pow(13)
    //)}`;
    return ethers.utils.parseUnits(value.toFixed(2), 18);
  }
  return value;
}
