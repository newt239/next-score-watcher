import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
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
  type FilterFn,
} from "@tanstack/react-table";
import { Filter } from "tabler-icons-react";

import ButtonLink from "#/app/_components/ButtonLink";
import TablePagenation from "#/components/common/TablePagination";
import { useDidUpdateEffect } from "#/hooks/useDidUpdateEffect";
import db from "#/utils/db";
import {
  GameDBPlayerProps,
  GamePlayersDB,
  PlayerDBProps,
  PlayersDB,
} from "#/utils/types";

type CompactPlayerTableProps = {
  game_id: string;
  playerList: PlayersDB["Insert"][];
  gamePlayers: GamePlayersDB["Insert"][];
};

const CompactPlayerTable: React.FC<CompactPlayerTableProps> = ({
  game_id,
  playerList,
  gamePlayers,
}) => {
  const gamePlayerIds = gamePlayers.map((gamePlayer) => gamePlayer.id);
  const [rowSelection, setRowSelection] = useState({});
  const [searchText, setSearchText] = useState<string>("");

  const fuzzyFilter: FilterFn<PlayerDBProps> = (row) => {
    const data = row.original;
    return (
      data.name?.includes(searchText) ||
      data.order?.includes(searchText) ||
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
                isChecked: row.getIsSelected(),
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
    const initialPlayerIdList: { [key: number]: boolean } = {};
    playerList.forEach((player, i) => {
      if (gamePlayerIds.includes(player.id)) {
        initialPlayerIdList[i] = true;
      }
    });
    setRowSelection(initialPlayerIdList);
  }, []);

  useDidUpdateEffect(() => {
    (async () => {
      const newGamePlayerIds = table
        .getSelectedRowModel()
        .rows.map(({ original }) => (original as PlayerDBProps).id);
      const newGamePlayers: GameDBPlayerProps[] = newGamePlayerIds.map(
        (player_id) => {
          const previousGamePlayer = gamePlayers.find(
            (gamePlayer) => gamePlayer.id === player_id
          );
          if (previousGamePlayer) {
            return previousGamePlayer;
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
        }
      );
      await db.games.update(game_id, {
        players: newGamePlayers,
      });
    })();
  }, [rowSelection]);

  return (
    <>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Filter />
        </InputLeftElement>
        <Input
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="フリーワードで検索"
          value={searchText}
        />
      </InputGroup>
      {table.getRowModel().rows.length === 0 ? (
        <Box p={3}>
          <Text>
            「{searchText}」に一致するプレイヤーは見つかりませんでした。
          </Text>
        </Box>
      ) : (
        <Box>
          <TableContainer>
            <Table size="sm">
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th colSpan={header.colSpan} key={header.id}>
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
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td key={cell.id}>
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
          <TablePagenation table={table} />
          <Box sx={{ pt: 3, textAlign: "right" }}>
            <ButtonLink href={`/player?from=${game_id}`}>詳細設定</ButtonLink>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CompactPlayerTable;
