"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Checkbox,
  Pagination,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
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
import { ArrowNarrowRight, Filter } from "tabler-icons-react";

import ButtonLink from "@/app/_components/ButtonLink";
import db from "@/utils/db";
import { GameDBPlayerProps, PlayerDBProps } from "@/utils/types";

type Props = {
  game_id: string;
  playerList: PlayerDBProps[];
  gamePlayers: GameDBPlayerProps[];
};

const CompactPlayerTable: React.FC<Props> = ({
  game_id,
  playerList,
  gamePlayers,
}) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const gamePlayerIds = gamePlayers.map((gamePlayer) => gamePlayer.id);
  const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [searchText, setSearchText] = useState<string>("");
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);

  const fuzzyFilter: FilterFn<PlayerDBProps> = (row) => {
    const data = row.original;
    return (
      data.name?.includes(searchText) ||
      data.text?.includes(searchText) ||
      data.belong?.includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<PlayerDBProps>();
  const columns = useMemo<ColumnDef<PlayerDBProps, any>[]>(
    () => [
      columnHelper.accessor("id", {
        header: "",
        cell: ({ row }) => {
          return (
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          );
        },
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("name", {
        header: "氏名",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("text", {
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

  const table = useReactTable<PlayerDBProps>({
    data: playerList,
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
    (async () => {
      const initialPlayerIdList: { [key: number]: boolean } = {};
      playerList.forEach((player, i) => {
        if (gamePlayerIds.includes(player.id)) {
          initialPlayerIdList[i] = true;
        }
      });
      setRowSelection(initialPlayerIdList);
    })();
  }, []);

  useDidUpdate(() => {
    (async () => {
      const newGamePlayerIds = table
        .getSelectedRowModel()
        .rows.map(({ original }) => (original as PlayerDBProps).id);
      if (!updateFlag) {
        setUpdateFlag(true);
      } else if (newGamePlayerIds.length !== gamePlayerIds.length) {
        const sortedNewGamePlayerIds = [
          ...gamePlayerIds.filter((gamePlayerId) =>
            newGamePlayerIds.includes(gamePlayerId)
          ),
          ...newGamePlayerIds.filter(
            (newGamePlayerId) => !gamePlayerIds.includes(newGamePlayerId)
          ),
        ];
        const newGamePlayers: GameDBPlayerProps[] = sortedNewGamePlayerIds.map(
          (player_id) => {
            const previousGamePlayer = gamePlayers.find(
              (gamePlayer) => gamePlayer.id === player_id
            );
            if (previousGamePlayer) {
              return previousGamePlayer;
            } else {
              const player = playerList.find(
                (player) => player.id === player_id
              );
              return {
                id: player_id,
                name: player ? player.name : "不明なユーザー",
                initial_correct: 0,
                initial_wrong: 0,
                base_correct_point: 1,
                base_wrong_point: -1,
              } as GameDBPlayerProps;
            }
          }
        );
        await db(currentProfile).games.update(game_id, {
          players: newGamePlayers,
        });
      }
    })();
  }, [rowSelection]);

  return (
    <>
      <TextInput
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="フリーワードで検索"
        value={searchText}
        rightSection={<Filter />}
      />
      {table.getRowModel().rows.length === 0 ? (
        <Text className="p-3">
          「{searchText}」に一致するプレイヤーは見つかりませんでした。
        </Text>
      ) : (
        <Box>
          <Table>
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th colSpan={header.colSpan} key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Table.Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Table.Td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
          {/* TODO: pagination */}
          <Pagination total={table.getPageCount()} />
          <Box className="pt-3 text-right">
            <ButtonLink
              rightSection={<ArrowNarrowRight />}
              href={`/players?from=${game_id}`}
              variant="subtle"
            >
              詳細設定
            </ButtonLink>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CompactPlayerTable;
