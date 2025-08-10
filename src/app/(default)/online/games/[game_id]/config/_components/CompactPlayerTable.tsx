"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

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

import type { GameDBPlayerProps, PlayerDBProps } from "@/utils/types";
import type { UseFormReturnType } from "@mantine/form";

import ButtonLink from "@/app/_components/ButtonLink";
import TablePagenation from "@/app/_components/TablePagination";
// import createApiClient from "@/utils/hono/client";

type Props = {
  game_id: string;
  playerList: PlayerDBProps[];
  gamePlayers: GameDBPlayerProps[];
  form: UseFormReturnType<
    {
      players: GameDBPlayerProps[];
    },
    (values: { players: GameDBPlayerProps[] }) => {
      players: GameDBPlayerProps[];
    }
  >;
};

/**
 * オンライン版コンパクトプレイヤーテーブルコンポーネント
 * プレイヤー選択テーブル
 */
const CompactPlayerTable: React.FC<Props> = ({
  game_id,
  playerList,
  gamePlayers,
  form,
}) => {
  const [isPending, startTransition] = useTransition();
  const gamePlayerIds = gamePlayers.map((gamePlayer) => gamePlayer.id);
  const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>(
    {}
  );
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
                disabled: isPending,
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
    [isPending]
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
    if (isPending) return;

    startTransition(async () => {
      try {
        const newGamePlayerIds = table
          .getSelectedRowModel()
          .rows.map(({ original }) => (original as PlayerDBProps).id);

        if (newGamePlayerIds.length !== gamePlayerIds.length) {
          const sortedNewGamePlayerIds = [
            // newGamePlayersのうちすでに選択されているプレイヤー
            ...gamePlayerIds.filter((gamePlayerId) =>
              newGamePlayerIds.includes(gamePlayerId)
            ),
            // newGamePlayersのうち今まで選択されていなかったプレイヤー
            ...newGamePlayerIds.filter(
              (newGamePlayerId) => !gamePlayerIds.includes(newGamePlayerId)
            ),
          ];

          const newGamePlayers: GameDBPlayerProps[] =
            sortedNewGamePlayerIds.map((player_id) => {
              const gamePlayer = gamePlayers.find(
                (gamePlayer) => gamePlayer.id === player_id
              );
              if (gamePlayer) {
                return gamePlayer;
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
            });

          // TODO: プレイヤーの一括更新APIが必要
          // const apiClient = createApiClient();
          // await apiClient.games.$patch({
          //   json: [{ id: game_id }],
          // });

          // フォームにおけるプレイヤーを更新
          form.setFieldValue("players", newGamePlayers);
        }
      } catch (error) {
        console.error("Failed to update game players:", error);
      }
    });
  }, [rowSelection]);

  return (
    <>
      <TextInput
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="フリーワードで検索"
        value={searchText}
        rightSection={<IconFilter />}
        disabled={isPending}
      />
      {table.getRowModel().rows.length === 0 ? (
        <Text p="sm">
          「{searchText}」に一致するプレイヤーは見つかりませんでした。
        </Text>
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
          </Table.ScrollContainer>
          <TablePagenation table={table} />
          <Group justify="flex-end" mt="sm">
            <ButtonLink
              leftSection={<IconSettings />}
              href={`/online/players?from=cloud-games/${game_id}`}
              variant="default"
              size="sm"
              disabled={isPending}
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
