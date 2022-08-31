import { createColumnHelper } from "@tanstack/react-table";

export type TokenInfo = {
  address: string;
  name: string;
  balance: number;
  price: number;
  thisDay: number;
  value: number;
  allocation: number;
};

export const tokenData: TokenInfo[] = [
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "token 1",
    balance: 1000,
    price: 1000,
    thisDay: 25.4,
    value: 1000,
    allocation: 10,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "token 2",
    balance: 1000,
    price: 1000,
    thisDay: 25.4,
    value: 1000,
    allocation: 10,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "token 3",
    balance: 1000,
    price: 1000,
    thisDay: 25.4,
    value: 1000,
    allocation: 10,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "token 4",
    balance: 1000,
    price: 1000,
    thisDay: 25.4,
    value: 1000,
    allocation: 10,
  },
  {
    address: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
    name: "token 5",
    balance: 1000,
    price: 1000,
    thisDay: 25.4,
    value: 1000,
    allocation: 10,
  },
];

const columnHelper = createColumnHelper<TokenInfo>();

export const tokenColumns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Asset",
  }),
  columnHelper.accessor("balance", {
    cell: (info) => info.getValue(),
    header: "Balance",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("thisDay", {
    cell: (info) => (
      <p style={{ color: info.getValue() > 0 ? "green" : "red" }}>
        {info.getValue()} %
      </p>
    ),
    header: "This Day",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("value", {
    cell: (info) => <p>${info.getValue()}</p>,
    header: "Value",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("allocation", {
    cell: (info) => <p>{info.getValue()} %</p>,
    header: "Allocation",
    meta: {
      isNumeric: true,
    },
  }),
];
