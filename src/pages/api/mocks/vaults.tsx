import { createColumnHelper } from "@tanstack/react-table";
import router from "next/router";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

// vault
export type VaultType = {
  address: string;
  name: string;
  aum: number;
  thisMonth: number;
  thisWeek: number;
  thisDay: number;
};

export const vaultData: VaultType[] = [
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "vault 1",
    aum: 1000,
    thisMonth: 25.4,
    thisWeek: 10,
    thisDay: -10,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "vault 2",
    aum: 1000,
    thisMonth: 25.4,
    thisWeek: 10,
    thisDay: -10,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "vault 3",
    aum: 1000,
    thisMonth: 25.4,
    thisWeek: 10,
    thisDay: -10,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "vault 4",
    aum: 1000,
    thisMonth: 25.4,
    thisWeek: 10,
    thisDay: -10,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "vault 5",
    aum: 1000,
    thisMonth: 25.4,
    thisWeek: 10,
    thisDay: -10,
  },
];
const columnHelper = createColumnHelper<VaultType>();

export const VaultColumns = [
  columnHelper.accessor("address", {
    cell: (info) => {
      return (
        <ExternalLinkIcon
          w={"3"}
          onClick={() => router.push("/vault/" + info.getValue())}
        />
      );
    },
    header: "",
  }),
  columnHelper.accessor("name", {
    cell: (info) => {
      console.log(info);
      return info.getValue();
    },
    header: "Name",
  }),
  columnHelper.accessor("aum", {
    cell: (info) => info.getValue(),
    header: "AUM",
  }),
  columnHelper.accessor("thisMonth", {
    cell: (info) => info.getValue(),
    header: "This Montth",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("thisWeek", {
    cell: (info) => info.getValue(),
    header: "This Week",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("thisDay", {
    cell: (info) => info.getValue(),
    header: "This Day",
    meta: {
      isNumeric: true,
    },
  }),
];
