/* eslint-disable import/named */
"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import Checkbox from "#/app/_components/Checkbox";
import TablePagination from "#/components/common/TablePagination";
import { PlayersDB } from "#/utils/types";

type PlayerTableProps = {
  players: PlayersDB["Row"][] | null;
};

const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  const columnHelper = createColumnHelper<PlayersDB["Row"]>();
  const columns: ColumnDef<PlayersDB["Row"], any>[] = [
    columnHelper.accessor("id", {
      header: ({ table }) => {
        return (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onChange={() => table.toggleAllRowsSelected()}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
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
    <>
      {players.length === 0 ? (
        <p>プレイヤーが登録されていません。</p>
      ) : (
        <>
          <div>
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => (
                      <th colSpan={header.colSpan} key={i}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.original.id}>
                      {row.getVisibleCells().map((cell, i) => {
                        return (
                          <td key={`${row.original.id}_${i}`}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <TablePagination table={table} />
        </>
      )}
    </>
  );
};
export default PlayerTable;
