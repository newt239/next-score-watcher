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

import type { ApiPlayerDataType } from "@/models/players";

import TablePagenation from "@/app/_components/TablePagination";

type Props = {
  players: ApiPlayerDataType[];
  deletePlayers: (playerIds: string[]) => Promise<boolean>;
  refetchPlayers: () => Promise<void>;
};

const PlayersTable: React.FC<Props> = ({
  players: playersProp,
  deletePlayers,
  refetchPlayers,
}) => {
  const [players, setPlayers] = useState<ApiPlayerDataType[]>(playersProp);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPlayers(playersProp);
  }, [playersProp]);

  const fuzzyFilter: FilterFn<ApiPlayerDataType> = (row) => {
    const data = row.original;
    return (
      data.name?.includes(searchText) ||
      data.text?.includes(searchText) ||
      data.belong?.includes(searchText) ||
      data.tags.join("").includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<ApiPlayerDataType>();
  const columns: ColumnDef<ApiPlayerDataType, string>[] = [
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

  const table = useReactTable<ApiPlayerDataType>({
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

  const handleDeletePlayers = async () => {
    startTransition(async () => {
      await deletePlayers(deletePlayerList);
      setSelectedPlayers({});
      await refetchPlayers();
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
                    onConfirm: handleDeletePlayers,
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

export default PlayersTable;
