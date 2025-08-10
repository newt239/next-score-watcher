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

import type { ApiQuizDataType } from "@/models/quizes";

import TablePagenation from "@/app/_components/TablePagination";

type Props = {
  quizes: ApiQuizDataType[];
  deleteQuizes: (quizIds: string[]) => Promise<boolean>;
  refetchQuizes: () => Promise<void>;
};

const QuizesTable: React.FC<Props> = ({
  quizes: quizesProp,
  deleteQuizes,
  refetchQuizes,
}) => {
  const [quizes, setQuizes] = useState<ApiQuizDataType[]>(quizesProp);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedQuizes, setSelectedQuizes] = useState({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuizes(quizesProp);
  }, [quizesProp]);

  const fuzzyFilter: FilterFn<ApiQuizDataType> = (row) => {
    const data = row.original;
    return (
      data.question?.includes(searchText) ||
      data.answer?.includes(searchText) ||
      data.category?.includes(searchText) ||
      data.annotation?.includes(searchText)
    );
  };

  const columnHelper = createColumnHelper<ApiQuizDataType>();
  const columns: ColumnDef<ApiQuizDataType, string>[] = [
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
    columnHelper.accessor("question", {
      header: "問題文",
      cell: ({ getValue }) => {
        const value = getValue();
        return value.length > 50 ? `${value.substring(0, 50)}...` : value;
      },
    }),
    columnHelper.accessor("answer", {
      header: "答え",
    }),
    columnHelper.accessor("category", {
      header: "カテゴリ",
    }),
  ];

  const table = useReactTable<ApiQuizDataType>({
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

  const deleteQuizList = table
    .getSelectedRowModel()
    .rows.map(({ original: quiz }) => quiz.id);

  const handleDeleteQuizes = async () => {
    startTransition(async () => {
      await deleteQuizes(deleteQuizList);
      setSelectedQuizes({});
      await refetchQuizes();
    });
  };

  return (
    <Box pt={5}>
      <h3>クイズ問題一覧</h3>
      {quizes.length === 0 ? (
        <Box p={3}>
          <Text>クイズ問題が登録されていません。</Text>
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
                    title: "クイズ問題を削除",
                    centered: true,
                    children: (
                      <>
                        選択中のクイズ問題{deleteQuizList.length}
                        問を削除します。
                      </>
                    ),
                    labels: { confirm: "削除する", cancel: "削除しない" },
                    confirmProps: { color: "red" },
                    onConfirm: handleDeleteQuizes,
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
                「{searchText}」に一致するクイズ問題は見つかりませんでした。
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

export default QuizesTable;
