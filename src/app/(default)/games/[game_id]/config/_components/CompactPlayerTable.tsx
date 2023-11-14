/* eslint-disable import/named */
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import { ArrowRight } from "tabler-icons-react";

import ButtonLink from "#/app/_components/ButtonLink";
import Checkbox from "#/app/_components/Checkbox";
import TextInput from "#/app/_components/TextInput";
import TablePagenation from "#/components/common/TablePagination";
import { useDidUpdateEffect } from "#/hooks/useDidUpdateEffect";
import { onGamePlayersUpdate } from "#/utils/actions";
import { globalGamePlayersAtom } from "#/utils/jotai";
import { PlayerPropsOnSupabase } from "#/utils/types";

type CompactPlayerTableProps = {
  game_id: string;
  players: PlayerPropsOnSupabase[];
  game_player_ids: string[];
};

const CompactPlayerTable: React.FC<CompactPlayerTableProps> = ({
  game_id,
  players,
  game_player_ids,
}) => {
  const [globalGamePlayers, setGlobalGamePlayers] = useAtom(
    globalGamePlayersAtom
  );
  const [rowSelection, setRowSelection] = useState({});
  const [searchText, setSearchText] = useState<string>("");

  const fuzzyFilter: FilterFn<PlayerPropsOnSupabase> = ({ original }) => {
    return (
      original.name?.includes(searchText) ||
      original.order?.includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<PlayerPropsOnSupabase>();
  const columns = useMemo<ColumnDef<PlayerPropsOnSupabase, any>[]>(
    () => [
      columnHelper.accessor("id", {
        header: "",
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onChange={() => row.toggleSelected()}
            />
          );
        },
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("name", {
        header: "氏名",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("order", {
        header: "順位",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("belong", {
        header: "所属",
        footer: (info) => info.column.id,
      }),
    ],
    []
  );

  const table = useReactTable<PlayerPropsOnSupabase>({
    data: players,
    columns,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setSearchText,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: searchText,
      rowSelection,
    },
  });

  useEffect(() => {
    const initialPlayerIdList: { [key: number]: boolean } = {};
    players.forEach((player, i) => {
      if (game_player_ids.includes(player.id)) {
        initialPlayerIdList[i] = true;
      }
    });
    setRowSelection(initialPlayerIdList);
  }, []);

  useDidUpdateEffect(() => {
    (async () => {
      const newGamePlayers = table
        .getSelectedRowModel()
        .rows.map(({ original }) => {
          return {
            id: original.id,
            name: original.name,
          };
        });
      onGamePlayersUpdate({
        game_id,
        players: newGamePlayers,
      });
    })();
  }, [rowSelection]);

  return (
    <>
      <TextInput
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="フリーワードで検索"
        value={searchText}
      />
      {table.getRowModel().rows.length === 0 ? (
        <p>「{searchText}」に一致するプレイヤーは見つかりませんでした。</p>
      ) : (
        <>
          <div>
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th colSpan={header.colSpan} key={header.id}>
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
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
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
          <TablePagenation table={table} />
          <div>
            <ButtonLink
              href={`/players?from=${game_id}`}
              rightIcon={<ArrowRight />}
              variant="subtle"
            >
              プレイヤーを作る
            </ButtonLink>
          </div>
        </>
      )}
    </>
  );
};

export default CompactPlayerTable;
