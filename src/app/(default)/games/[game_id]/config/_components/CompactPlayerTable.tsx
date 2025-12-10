"use client";

import { useEffect, useMemo, useState } from "react";

import { Checkbox, Group, Table, Text, TextInput } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { IconFilter, IconSettings } from "@tabler/icons-react";
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
import { useLiveQuery } from "dexie-react-hooks";

import type { GameDBPlayerProps, PlayerDBProps } from "@/utils/types";
import type { UseFormReturnType } from "@mantine/form";

import ButtonLink from "@/components/ButtonLink";
import TablePagenation from "@/components/TablePagination";
import db from "@/utils/db";

type Props = {
  game_id: string;
  playerList: PlayerDBProps[];
  gamePlayers: GameDBPlayerProps[];
  currentProfile: string;
  form: UseFormReturnType<
    {
      players: GameDBPlayerProps[];
    },
    (values: { players: GameDBPlayerProps[] }) => {
      players: GameDBPlayerProps[];
    }
  >;
};

const CompactPlayerTable: React.FC<Props> = ({
  game_id,
  playerList,
  gamePlayers,
  currentProfile,
  form,
}) => {
  const logs = useLiveQuery(() => db(currentProfile).logs.toArray(), []);

  const gamePlayerIds = gamePlayers.map((gamePlayer) => gamePlayer.id);
  const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});
  const [searchText, setSearchText] = useState<string>("");

  const fuzzyFilter: FilterFn<PlayerDBProps> = (row) => {
    const data = row.original;
    return (
      data.name?.includes(searchText) ||
      data.text?.includes(searchText) ||
      data.belong?.includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<PlayerDBProps>();
  const columns = useMemo<ColumnDef<PlayerDBProps, string>[]>(
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

  // didにしておかないと選択状態がリセットされる
  useDidUpdate(() => {
    (async () => {
      const newGamePlayerIds = table
        .getSelectedRowModel()
        .rows.map(({ original }) => (original as PlayerDBProps).id);
      if (newGamePlayerIds.length !== gamePlayerIds.length) {
        const sortedNewGamePlayerIds = [
          // newGamePlayersのうちすでに選択されているプレイヤー
          ...gamePlayerIds.filter((gamePlayerId) => newGamePlayerIds.includes(gamePlayerId)),
          // newGamePlayersのうち今まで選択されていなかったプレイヤー
          ...newGamePlayerIds.filter((newGamePlayerId) => !gamePlayerIds.includes(newGamePlayerId)),
        ];

        // 選択が解除されたプレイヤーのゲームログを削除
        const removedGamePlayerIds = gamePlayerIds.filter(
          (gamePlayerId) => !newGamePlayerIds.includes(gamePlayerId)
        );
        const deleteGameLogIdList = logs
          ?.filter((log) => removedGamePlayerIds.includes(log.player_id))
          .map((log) => log.id);
        if (deleteGameLogIdList) {
          await db(currentProfile).logs.bulkDelete(deleteGameLogIdList);
        }

        const newGamePlayers: GameDBPlayerProps[] = sortedNewGamePlayerIds.map((player_id) => {
          const gamePlayer = gamePlayers.find((gamePlayer) => gamePlayer.id === player_id);
          if (gamePlayer) {
            return gamePlayer;
          } else {
            const player = playerList.find((player) => player.id === player_id);
            return {
              id: player_id,
              name: player ? player.name : "不明なユーザー",
              initial_correct: 0,
              initial_wrong: 0,
              base_correct_point: 1,
              base_wrong_point: -1,
            } as GameDBPlayerProps;
          }
        });

        await db(currentProfile).games.update(game_id, {
          players: newGamePlayers,
        });

        // フォームにおけるプレイヤーを更新
        form.setFieldValue("players", newGamePlayers);
      }
    })();
  }, [rowSelection]);

  return (
    <>
      <TextInput
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="フリーワードで検索"
        value={searchText}
        rightSection={<IconFilter />}
      />
      {table.getRowModel().rows.length === 0 ? (
        <Text p="sm">「{searchText}」に一致するプレイヤーは見つかりませんでした。</Text>
      ) : (
        <>
          <Table.ScrollContainer minWidth={500}>
            <Table highlightOnHover>
              <Table.Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.Th colSpan={header.colSpan} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
          <TablePagenation table={table} />
          <Group justify="flex-end" mt="sm">
            <ButtonLink
              leftSection={<IconSettings />}
              href={`/players?from=${game_id}`}
              variant="default"
              size="sm"
            >
              詳細設定
            </ButtonLink>
          </Group>
        </>
      )}
    </>
  );
};

export default CompactPlayerTable;
