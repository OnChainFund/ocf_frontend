import { createColumnHelper } from "@tanstack/react-table";

//depositer
export type DepositerInfo = {
  address: string;
  time: number;
  shareNumber: number;
  percent: number;
};

export const DepositerData: DepositerInfo[] = [
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    time: 10,
    shareNumber: 1000,
    percent: 20,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    time: 10,
    shareNumber: 1000,
    percent: 20,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    time: 10,
    shareNumber: 1000,
    percent: 20,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    time: 10,
    shareNumber: 1000,
    percent: 20,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    time: 10,
    shareNumber: 1000,
    percent: 20,
  },
];

const columnHelper = createColumnHelper<DepositerInfo>();

export const Depositercolumns = [
  columnHelper.accessor("address", {
    cell: (info) => info.getValue(),
    header: "Address",
  }),
  columnHelper.accessor("time", {
    cell: (info) => <p>{info.getValue()} month</p>,
    header: "Since",
  }),
  columnHelper.accessor("shareNumber", {
    cell: (info) => info.getValue(),
    header: "Amount of Share",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("percent", {
    cell: (info) => <p>{info.getValue()}%</p>,
    header: "Percent",
    meta: {
      isNumeric: true,
    },
  }),
];
