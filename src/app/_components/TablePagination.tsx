import { ActionIcon, Group, NativeSelect, Text } from "@mantine/core";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "tabler-icons-react";

import { PlayerDBProps, QuizDBProps } from "@/utils/types";

type Props = {
  table: Table<PlayerDBProps> | Table<QuizDBProps>;
};

const TablePagenation: React.FC<Props> = ({ table }) => {
  return (
    <Group justify="end">
      <Text>
        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
      </Text>
      <ActionIcon.Group>
        <ActionIcon
          aria-label="最初のページに移動"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex(0)}
          size="lg"
        >
          <ChevronsLeft />
        </ActionIcon>
        <ActionIcon
          aria-label="1ページ戻る"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          size="lg"
        >
          <ChevronLeft />
        </ActionIcon>
        <ActionIcon
          aria-label="1ページ進む"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          size="lg"
        >
          <ChevronRight />
        </ActionIcon>
        <ActionIcon
          aria-label="最後のページに移動"
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          size="lg"
        >
          <ChevronsRight />
        </ActionIcon>
      </ActionIcon.Group>
      <NativeSelect
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        size="sm"
        value={table.getState().pagination.pageSize}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}件
          </option>
        ))}
      </NativeSelect>
    </Group>
  );
};

export default TablePagenation;
