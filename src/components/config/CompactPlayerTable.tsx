import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  type ColumnDef,
  flexRender,
  useReactTable,
  createColumnHelper,
  getFilteredRowModel,
  getPaginationRowModel,
  getCoreRowModel,
  type FilterFn,
} from "@tanstack/react-table";
import {
  ArrowNarrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
} from "tabler-icons-react";

import db, { GameDBPlayerProps, PlayerDBProps } from "#/utils/db";

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
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");

  const onChangeHandler = async (player: PlayerDBProps) => {
    if (gamePlayers.map((gamePlayer) => gamePlayer.id).includes(player.id)) {
      await db.games.update(game_id, {
        players: gamePlayers.filter((gamePlayer) => gamePlayer.id != player.id),
      });
    } else {
      await db.games.update(game_id, {
        players: [
          ...gamePlayers,
          {
            id: player.id,
            name: player.name,
            initial_correct: 0,
            initial_wrong: 0,
            base_correct_point: 3,
            base_wrong_point: -3,
          } as GameDBPlayerProps,
        ],
      });
    }
  };

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
      header: "",
      cell: (info) => {
        return (
          <Checkbox
            onChange={() => onChangeHandler(info.row.original)}
            isChecked={gamePlayers
              .map((gamePlayer) => gamePlayer.id)
              .includes(info.getValue())}
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
      header: "サブテキスト",
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
          <Tag key={tagi} colorScheme="green" size="sm">
            {tag}
          </Tag>
        ));
      },
      footer: (info) => info.column.id,
    }),
  ];

  const table = useReactTable<PlayerDBProps>({
    data: playerList,
    columns,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: searchText,
    },
  });

  return (
    <>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Filter />
        </InputLeftElement>
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="フリーワードで検索"
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
                      <Th key={header.id} colSpan={header.colSpan}>
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
          <HStack pt={3}>
            <IconButton
              aria-label="最初のページに移動"
              icon={<ChevronsLeft />}
              size="xs"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            />
            <IconButton
              aria-label="1ページ戻る"
              icon={<ChevronLeft />}
              size="xs"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            />
            <div>
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </div>
            <IconButton
              aria-label="1ページ進む"
              icon={<ChevronRight />}
              size="xs"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            />
            <IconButton
              aria-label="最後のページに移動"
              icon={<ChevronsRight />}
              size="xs"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            />
            <Box>
              <Select
                size="sm"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}件
                  </option>
                ))}
              </Select>
            </Box>
          </HStack>
          <Box sx={{ pt: 3, textAlign: "right" }}>
            <NextLink href={`/player?from=${game_id}`}>
              <Button
                colorScheme="green"
                variant="ghost"
                rightIcon={<ArrowNarrowRight />}
              >
                詳細設定
              </Button>
            </NextLink>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CompactPlayerTable;
