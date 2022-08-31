import { createColumnHelper } from "@tanstack/react-table";

export type feeType = {
  feeType: string;
  rate: number;
  unpaidFee: number;
};

export const tokenData: feeType[] = [
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

const columnHelper = createColumnHelper<feeType>();

export const tokenColumns = [
  columnHelper.accessor("feeType", {
    cell: (info) => info.getValue(),
    header: "Fee Type",
  }),
  columnHelper.accessor("rate", {
    cell: (info) => info.getValue(),
    header: "Rate",
  }),
  columnHelper.accessor("unpaidFee", {
    cell: (info) => (
      <p style={{ color: info.getValue() > 0 ? "" : "" }}>
        {info.getValue()} shares
      </p>
    ),
    header: "Unpaid Fee",
    meta: {
      isNumeric: true,
    },
  }),
];
