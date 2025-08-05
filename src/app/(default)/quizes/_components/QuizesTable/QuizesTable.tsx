import { useState } from "react";

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
import { IconFilter, IconTrash } from "@tabler/icons-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type FilterFn,
} from "@tanstack/react-table";
import { useLiveQuery } from "dexie-react-hooks";

import classes from "./QuizesTable.module.css";

import TablePagenation from "@/app/_components/TablePagination";
import db from "@/utils/db";
import { QuizDBProps } from "@/utils/types";

type Props = {
  currentProfile: string;
};

const QuizesTable: React.FC<Props> = ({ currentProfile }) => {
  const quizes = useLiveQuery(
    () => db(currentProfile).quizes.orderBy("set_name").sortBy("n"),
    []
  );
  const [searchText, setSearchText] = useState<string>("");

  const [selectedQuizes, setSelectedQuizes] = useState({});

  const fuzzyFilter: FilterFn<QuizDBProps> = (row) => {
    const data = row.original;
    return (
      data.q?.includes(searchText) ||
      data.a?.includes(searchText) ||
      data.set_name?.includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<QuizDBProps>();
  const columns = [
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
    columnHelper.accessor("n", {
      header: "No.",
    }),
    columnHelper.accessor("q", {
      header: "問題文",
    }),
    columnHelper.accessor("a", {
      header: "答え",
    }),
    columnHelper.accessor("set_name", {
      header: "セット名",
    }),
  ];

  const table = useReactTable<QuizDBProps>({
    data: quizes || [],
    columns,
    state: {
      rowSelection: selectedQuizes,
      globalFilter: searchText,
    },
    onRowSelectionChange: setSelectedQuizes,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!quizes) return null;

  return (
    <Box pt={5}>
      <h3>問題一覧</h3>
      {quizes.length === 0 ? (
        <Box p={3}>
          <Text>問題が登録されていません。</Text>
        </Box>
      ) : (
        <Box>
          {
            <Group justify="end" gap="1rem">
              {table.getSelectedRowModel().rows.length !== 0 && (
                <Button
                  color="red"
                  leftSection={<IconTrash />}
                  onClick={() =>
                    modals.openConfirmModal({
                      title: "クイズを削除",
                      centered: true,
                      children: (
                        <>
                          選択中のクイズ
                          {table.getSelectedRowModel().rows.length}
                          件を削除します。
                        </>
                      ),
                      labels: { confirm: "削除する", cancel: "削除しない" },
                      confirmProps: { color: "red" },
                      onConfirm: () => {
                        db(currentProfile).quizes.bulkDelete(
                          table
                            .getSelectedRowModel()
                            .rows.map((row) => row.original.id)
                        );
                        notifications.show({
                          message: `${
                            table.getSelectedRowModel().rows.length
                          } 件の問題を削除しました`,
                          autoClose: 9000,
                          withCloseButton: true,
                        });
                        setSelectedQuizes({});
                      },
                    })
                  }
                  size="sm"
                >
                  削除
                </Button>
              )}
              <Box>
                <TextInput
                  leftSection={<IconFilter />}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="問題文・答え・セット名で検索"
                  value={searchText}
                />
              </Box>
            </Group>
          }
          {table.getRowModel().rows.length === 0 ? (
            <Box p={3}>
              <Text>
                「{searchText}」に一致する問題データは見つかりませんでした。
              </Text>
            </Box>
          ) : (
            <>
              <Table.ScrollContainer minWidth={1000}>
                <Table highlightOnHover className={classes.quizes_table}>
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
                              <Table.Td
                                key={`${row.original.id}_${i}`}
                                w={cell.column.id === "a" ? 300 : undefined}
                              >
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
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default QuizesTable;
