import { Column } from "react-table";

//depositer
export type DepositerInfo = {
  address: string;
  time: number;
  shareNumber: number;
  percent: number;
};

export const depositerDatas: DepositerInfo[] = [
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

export type DepositerColumn = Column<DepositerInfo> & {
  isNumeric: boolean;
};

export const depositerColumns: DepositerColumn[] = [
  {
    Header: "Address",
    accessor: "address",
    isNumeric: false,
  },
  {
    Header: "Since",
    accessor: "time",
    isNumeric: true,
    Cell: (props) => {
      return <p>{props.value} month</p>;
    },
  },
  {
    Header: "Amount of Share",
    accessor: "shareNumber",
    isNumeric: true,
  },

  {
    Header: "Percent",
    accessor: "percent",
    isNumeric: true,
    Cell: (props) => {
      return <p>{props.value}%</p>;
    },
  },
];
