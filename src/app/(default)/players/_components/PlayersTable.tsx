"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  List,
  ListItem,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
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
import { Trash } from "tabler-icons-react";

import TablePagenation from "@/app/_components/TablePagination";
import db from "@/utils/db";
import { PlayerDBProps } from "@/utils/types";

const PlayersTable: React.FC = () => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const games = useLiveQuery(() => db(currentProfile).games.toArray(), []);
  const players = useLiveQuery(
    () => db(currentProfile).players.orderBy("name").toArray(),
    []
  );
  const [searchText, setSearchText] = useState<string>("");

  const [selectedPlayers, setSelectedPlayers] = useState({});

  const fuzzyFilter: FilterFn<PlayerDBProps> = (row) => {
    const data = row.original;
    return (
      data.name?.includes(searchText) ||
      data.text?.includes(searchText) ||
      data.belong?.includes(searchText) ||
      data.tags.join("").includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<PlayerDBProps>();
  const columns: ColumnDef<PlayerDBProps, any>[] = [
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
      header: "順位",
    }),
    columnHelper.accessor("belong", {
      header: "所属",
    }),
  ];

  const table = useReactTable<PlayerDBProps>({
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

  if (!games || !players) return null;

  const deletePlayerList = table
    .getSelectedRowModel()
    .rows.map(({ original: player }) => player.id);
  const affectedGameList = games.filter((game) =>
    game.players
      .map((gamePlayer) => deletePlayerList.includes(gamePlayer.id))
      .includes(true)
  );

  const deletePlayers = async () => {
    await db(currentProfile).players.bulkDelete(deletePlayerList);
    await db(currentProfile)
      .logs.where("player_id")
      .anyOf(deletePlayerList)
      .delete();
    await db(currentProfile)
      .games.where("id")
      .anyOf(affectedGameList.map((game) => game.id))
      .modify({ players: [] });
    notifications.show({
      title: `${deletePlayerList.length}人のプレイヤーを削除しました`,
      message: table
        .getSelectedRowModel()
        .rows.map(({ original: player }) => player.name)
        .join(", ")
        .slice(0, 20),
      autoClose: 9000,
      withCloseButton: true,
    });
    setSelectedPlayers({});
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
          {
            <Flex className="justify-end gap-3 pb-5">
              {table.getSelectedRowModel().rows.length !== 0 && (
                <Button
                  color="red"
                  leftSection={<Trash />}
                  onClick={() =>
                    modals.openConfirmModal({
                      title: "ゲームを削除",
                      centered: true,
                      children: (
                        <>
                          選択中のプレイヤー{deletePlayerList.length}
                          人を削除します。
                          {affectedGameList.length !== 0 && (
                            <>
                              この操作により、以下{affectedGameList.length}
                              件のゲームのプレイヤーの選択状態及びログがリセットされます。
                              <List>
                                {affectedGameList.map((game) => (
                                  <ListItem key={game.id}>{game.name}</ListItem>
                                ))}
                              </List>
                            </>
                          )}
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
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="フリーワードで検索"
                  className="max-w-[300px]"
                  value={searchText}
                />
              </Box>
            </Flex>
          }
          {table.getRowModel().rows.length === 0 ? (
            <Box p={3}>
              <Text>
                「{searchText}」に一致するプレイヤーは見つかりませんでした。
              </Text>
            </Box>
          ) : (
            <>
              <Table>
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
