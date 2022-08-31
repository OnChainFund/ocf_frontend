import { useTable, useSortBy, Column } from "react-table";

// vault
export type VaultType = {
  address: string;
  name: string;
  aum: number;
  thisMonth: number;
  thisWeek: number;
  thisDay: number;
};

export const vaultDatas: VaultType[] = [
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

export type VaultColumnType = Column<VaultType> & {
  isNumeric: boolean;
};
export const VaultColumnDatas: VaultColumnType[] = [
  {
    Header: "Name",
    accessor: "name",
    isNumeric: false,
  },
  {
    Header: "AUM",
    accessor: "aum",
    isNumeric: false,
  },
  {
    Header: "This Month",
    accessor: "thisMonth",
    isNumeric: true,
  },
  {
    Header: "This Week",
    accessor: "thisWeek",
    isNumeric: true,
  },
  {
    Header: "This Day",
    accessor: "thisDay",
    isNumeric: true,
  },
];
