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

import { useGameState } from "../../_hooks/useGameState";

import type { PlayerProps, RemoveGamePlayersResponseType } from "@/models/game";

import TablePagenation from "@/app/_components/TablePagination";
import ButtonLink from "@/components/ButtonLink";
import createApiClient from "@/utils/hono/browser";

type CompactPlayerTableProps = {
  game_id: string;
  gamePlayerIds: string[];
  players: PlayerProps[];
  onPlayersChange?: (newGamePlayerIds: string[]) => void;
};

/**
 * オンライン版コンパクトプレイヤーテーブルコンポーネント
 * プレイヤー選択テーブル
 */
const CompactPlayerTable: React.FC<CompactPlayerTableProps> = ({
  game_id,
  gamePlayerIds,
  players,
  onPlayersChange,
}) => {
  const [isPending, startTransition] = useTransition();
  const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [searchText, setSearchText] = useState<string>("");
  const { updateGame } = useGameState();

  const fuzzyFilter: FilterFn<PlayerProps> = (row) => {
    const data = row.original;
    return (
      data.name?.includes(searchText) ||
      data.description?.includes(searchText) ||
      data.affiliation?.includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<PlayerProps>();
  const columns = useMemo<ColumnDef<PlayerProps, string>[]>(
    () => [
      columnHelper.accessor("id", {
        header: "氏名",
        cell: ({ row }) => {
          return (
            <Checkbox
              label={row.original.name}
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
      columnHelper.accessor("description", {
        header: "順位",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("affiliation", {
        header: "所属",
        footer: (info) => info.column.id,
      }),
    ],
    [isPending]
  );

  const table = useReactTable<PlayerProps>({
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
    (async () => {
      const initialPlayerIdList: { [key: number]: boolean } = {};
      players.forEach((player, i) => {
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
      const apiClient = createApiClient();

      // 現在選択されているプレイヤーIDを取得
      const newSelectedPlayerIds = table
        .getSelectedRowModel()
        .rows.map(({ original }) => original.id);

      // 追加されたプレイヤー（新しく選択されたもの）
      const addedPlayerIds = newSelectedPlayerIds.filter(
        (playerId) => !gamePlayerIds.includes(playerId)
      );

      // 削除されたプレイヤー（選択が解除されたもの）
      const removedPlayerIds = gamePlayerIds.filter(
        (playerId) => !newSelectedPlayerIds.includes(playerId)
      );

      try {
        // プレイヤーを追加
        if (addedPlayerIds.length > 0) {
          for (const playerId of addedPlayerIds) {
            const currentPlayerCount = newSelectedPlayerIds.length;
            await apiClient.games[":gameId"].players.$post({
              param: { gameId: game_id },
              json: {
                playerId,
                displayOrder: currentPlayerCount,
                initialScore: 0,
                initialCorrectCount: 0,
                initialWrongCount: 0,
              },
            });
          }
        }

        // プレイヤーを削除
        if (removedPlayerIds.length > 0) {
          const response = await apiClient.games[":gameId"].players.$delete({
            param: { gameId: game_id },
            json: { playerIds: removedPlayerIds },
          });

          if (response.ok) {
            const data: RemoveGamePlayersResponseType = await response.json();
            console.log(`プレイヤー削除完了: ${data.message}`);
          }
        }

        // 親コンポーネントに新しいプレイヤーIDリストを通知
        if (
          (addedPlayerIds.length > 0 || removedPlayerIds.length > 0) &&
          onPlayersChange
        ) {
          onPlayersChange(newSelectedPlayerIds);
        }

        // ゲーム状態を更新してGameStartButtonに反映
        if (addedPlayerIds.length > 0 || removedPlayerIds.length > 0) {
          await updateGame();
        }
      } catch (error) {
        console.error("プレイヤー設定の更新に失敗しました:", error);
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
              href={`/online/players?from=online/games/${game_id}`}
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
