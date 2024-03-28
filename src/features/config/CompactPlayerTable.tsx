import { useEffect, useMemo, useState } from "react";

import {
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
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
import { ArrowNarrowRight, Filter } from "tabler-icons-react";

import ButtonLink from "#/components/ButtonLink";
import TablePagenation from "#/features/components/TablePagination";
import { useDidUpdateEffect } from "#/features/hooks/useDidUpdateEffect";
import db from "#/utils/db";
import { GameDBPlayerProps, PlayerDBProps } from "#/utils/types";
import { css } from "@panda/css";

type CompactPlayerTableProps = {
  game_id: string;
  playerList: PlayerDBProps[];
  gamePlayers: GameDBPlayerProps[];
};

const CompactPlayerTable: React.FC<CompactPlayerTableProps> = ({
  game_id,
  playerList,
  gamePlayers,
}) => {
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
      data.belong?.includes(searchText) ||
      data.tags.join("").includes(searchText)
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
      columnHelper.accessor("text", {
        header: "順位",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("belong", {
        header: "所属",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("tags", {
        header: "タグ",
        cell: (info) => {
          return info.row.original.tags.map((tag, tagi) => (
            <Tag colorScheme="green" key={tagi} size="sm">
              {tag}
            </Tag>
          ));
        },
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

  useDidUpdateEffect(() => {
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
        await db.games.update(game_id, {
          players: newGamePlayers,
        });
      }
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
        <div>
          <p>「{searchText}」に一致するプレイヤーは見つかりませんでした。</p>
        </div>
      ) : (
        <div>
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
          <div className={css({ pt: 3, textAlign: "right" })}>
            <ButtonLink
              href={`/player?from=${game_id}`}
              rightIcon={<ArrowNarrowRight />}
            >
              詳細設定
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
};

export default CompactPlayerTable;
