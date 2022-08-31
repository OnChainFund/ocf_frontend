import { Column } from "react-table";

//token
export type TokenInfo = {
  address: string;
  name: string;
  balance: number;
  price: number;
  thisDay: number;
  value: number;
  allocation: number;
};

export const tokenDatas: TokenInfo[] = [
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

export type TokenColumn = Column<TokenInfo> & {
  isNumeric: boolean;
};

export const tokenColumns: TokenColumn[] = [
  {
    Header: "Asset",
    accessor: "name",
    isNumeric: false,
  },
  {
    Header: "Balance",
    accessor: "balance",
    isNumeric: true,
  },
  {
    Header: "Price",
    accessor: "price",
    isNumeric: true,
  },
  {
    Header: "This Day",
    accessor: "thisDay",
    isNumeric: true,
    Cell: (props) => {
      return (
        <p style={{ color: props.value > 0 ? "green" : "red" }}>
          {props.value} %
        </p>
      );
    },
  },
  {
    Header: "Value",
    accessor: "value",
    isNumeric: true,
    Cell: (props) => {
      return <p>${props.value}</p>;
    },
  },
  {
    Header: "Allocation",
    accessor: "allocation",
    isNumeric: true,
    Cell: (props) => {
      return <p>{props.value} %</p>;
    },
  },
];
