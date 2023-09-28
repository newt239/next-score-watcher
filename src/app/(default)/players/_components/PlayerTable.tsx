/* eslint-disable import/named */
"use client";

import {
  Box,
  Checkbox,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import TablePagination from "#/components/common/TablePagination";
import { PlayersDB } from "#/utils/types";

type PlayerTableProps = {
  players: PlayersDB["Row"][];
};

const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  const columnHelper = createColumnHelper<PlayersDB["Row"]>();
  const columns: ColumnDef<PlayersDB["Row"], any>[] = [
    columnHelper.accessor("id", {
      header: ({ table }) => {
        return (
          <Checkbox
            isChecked={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={() => table.toggleAllRowsSelected()}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            isChecked={row.getIsSelected()}
            onChange={() => row.toggleSelected()}
          />
        );
      },
    }),
    columnHelper.accessor("name", {
      header: "氏名",
    }),
    columnHelper.accessor("order", {
      header: "順位",
    }),
    columnHelper.accessor("belong", {
      header: "所属",
    }),
  ];

  const table = useReactTable<PlayersDB["Row"]>({
    data: players || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!players) return null;

  return (
    <Box pt={5}>
      <h3>プレイヤー一覧</h3>
      {players.length === 0 ? (
        <Box p={3}>
          <Text>プレイヤーが登録されていません。</Text>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table size="sm">
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => (
                      <Th colSpan={header.colSpan} key={i}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <Tr key={row.original.id}>
                      {row.getVisibleCells().map((cell, i) => {
                        return (
                          <Td key={`${row.original.id}_${i}`}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          <TablePagination table={table} />
        </>
      )}
    </Box>
  );
};
export default PlayerTable;
