import { Column } from "react-table";

//token
export type feeType = {
  feeType: string;
  rate: number;
  unpaidFee: number;
};

export const tokenDatas: feeType[] = [
  {
    feeType: "Performance Fee",
    rate: 10,
    unpaidFee: 5,
  },
  {
    feeType: "Protocol Fee",
    rate: 0.25,
    unpaidFee: 0.1,
  },
];

export const tokenColumns: Column<feeType>[] = [
  {
    Header: "Fee Type",
    accessor: "feeType",
  },
  {
    Header: "Rate",
    accessor: "rate",
  },
  {
    Header: "Unpaid Fee",
    accessor: "unpaidFee",
    Cell: (props) => {
      return (
        <p style={{ color: props.value > 0 ? "" : "" }}>{props.value} shares</p>
      );
    },
  },
];
