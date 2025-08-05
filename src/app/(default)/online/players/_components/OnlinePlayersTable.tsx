"use client";

import { useEffect, useState, useTransition } from "react";

import {
  Box,
  Button,
  Checkbox,
  Group,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
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

import type { ApiPlayerData } from "@/models/players";

import TablePagenation from "@/app/_components/TablePagination";
import apiClient from "@/utils/hono/client";

type Props = {
  currentProfile: string;
  players: ApiPlayerData[];
  onPlayersUpdated: (players: ApiPlayerData[]) => void;
};

const OnlinePlayersTable: React.FC<Props> = ({
  currentProfile: _currentProfile,
  players: playersProp,
  onPlayersUpdated,
}) => {
  const [players, setPlayers] = useState<ApiPlayerData[]>(playersProp);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [isPending, startTransition] = useTransition();

  // propsの変更を監視してローカル状態を更新
  useEffect(() => {
    setPlayers(playersProp);
  }, [playersProp]);

  const _fetchPlayers = async () => {
    try {
      const response = await apiClient.players.$get({ query: {} });
      if (!response.ok) {
        throw new Error("プレイヤー一覧の取得に失敗しました");
      }
      const data = await response.json();
      setPlayers(data.data.players || []);
    } catch (_error) {
      notifications.show({
        title: "エラー",
        message:
          _error instanceof Error
            ? _error.message
            : "不明なエラーが発生しました",
        color: "red",
      });
    }
  };

  const fuzzyFilter: FilterFn<ApiPlayerData> = (row) => {
    const data = row.original;
    return (
      data.name?.includes(searchText) ||
      data.text?.includes(searchText) ||
      data.belong?.includes(searchText) ||
      data.tags.join("").includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<ApiPlayerData>();
  const columns: ColumnDef<ApiPlayerData, string>[] = [
    columnHelper.accessor("id", {
      header: ({ table }) => {
        return (
          <Checkbox
            radius="xs"
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={() => table.toggleAllRowsSelected()}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            radius="xs"
            checked={row.getIsSelected()}
            onChange={() => row.toggleSelected()}
          />
        );
      },
    }),
    columnHelper.accessor("name", {
      header: "氏名",
    }),
    columnHelper.accessor("text", {
      header: "表示名",
    }),
    columnHelper.accessor("belong", {
      header: "所属",
    }),
  ];

  const table = useReactTable<ApiPlayerData>({
    data: players || [],
    columns,
    state: {
      rowSelection: selectedPlayers,
      globalFilter: searchText,
    },
    onRowSelectionChange: setSelectedPlayers,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const deletePlayerList = table
    .getSelectedRowModel()
    .rows.map(({ original: player }) => player.id);

  const deletePlayers = async () => {
    startTransition(async () => {
      try {
        const deletePromises = deletePlayerList.map((playerId) =>
          apiClient.players[":id"].$delete({ param: { id: playerId } })
        );

        await Promise.all(deletePromises);

        notifications.show({
          title: `${deletePlayerList.length}人のプレイヤーを削除しました`,
          message: table
            .getSelectedRowModel()
            .rows.map(({ original: player }) => player.text)
            .join(", ")
            .slice(0, 20),
          autoClose: 9000,
          withCloseButton: true,
        });

        setSelectedPlayers({});

        // ローカル状態とparent両方を更新
        const response = await apiClient.players.$get({ query: {} });
        if (response.ok) {
          const data = await response.json();
          const updatedPlayers = data.data.players || [];
          setPlayers(updatedPlayers);
          onPlayersUpdated(updatedPlayers);
        }
      } catch (_error) {
        notifications.show({
          title: "エラー",
          message: "プレイヤーの削除に失敗しました",
          color: "red",
        });
      }
    });
  };

  return (
    <Box pt={5}>
      <h3>プレイヤー一覧</h3>
      {players.length === 0 ? (
        <Box p={3}>
          <Text>プレイヤーが登録されていません。</Text>
        </Box>
      ) : (
        <Box>
          <Group justify="flex-end" gap="lg" pb="lg">
            {table.getSelectedRowModel().rows.length !== 0 && (
              <Button
                color="red"
                leftSection={<IconTrash />}
                disabled={isPending}
                loading={isPending}
                onClick={() =>
                  modals.openConfirmModal({
                    title: "プレイヤーを削除",
                    centered: true,
                    children: (
                      <>
                        選択中のプレイヤー{deletePlayerList.length}
                        人を削除します。
                      </>
                    ),
                    labels: { confirm: "削除する", cancel: "削除しない" },
                    confirmProps: { color: "red" },
                    onConfirm: deletePlayers,
                  })
                }
                size="sm"
              >
                削除
              </Button>
            )}
            <Box>
              <TextInput
                maw={300}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="フリーワードで検索"
                value={searchText}
              />
            </Box>
          </Group>
          {table.getRowModel().rows.length === 0 ? (
            <Box p={3}>
              <Text>
                「{searchText}」に一致するプレイヤーは見つかりませんでした。
              </Text>
            </Box>
          ) : (
            <>
              <Table highlightOnHover>
                <Table.Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Table.Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, i) => (
                        <Table.Th colSpan={header.colSpan} key={i}>
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
                      <Table.Tr key={row.original.id}>
                        {row.getVisibleCells().map((cell, i) => {
                          return (
                            <Table.Td key={`${row.original.id}_${i}`}>
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
              <TablePagenation table={table} />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OnlinePlayersTable;
