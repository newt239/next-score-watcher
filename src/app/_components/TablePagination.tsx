import { Group, NativeSelect, Pagination } from "@mantine/core";
import { Table } from "@tanstack/react-table";

import { PlayerDBProps, QuizDBProps } from "@/utils/types";

type Props = {
  table: Table<PlayerDBProps> | Table<QuizDBProps>;
};

const TablePagenation: React.FC<Props> = ({ table }) => {
  return (
    <Group justify="space-between">
      <Pagination.Root
        total={table.getPageCount()}
        value={table.getState().pagination.pageIndex + 1}
        onChange={(n) => table.setPageIndex(n - 1)}
        size="sm"
      >
        <Group gap={5} justify="center">
          <Pagination.First />
          <Pagination.Previous />
          <Pagination.Control active>
            {table.getState().pagination.pageIndex + 1}
          </Pagination.Control>
          <Pagination.Next />
          <Pagination.Last />
        </Group>
      </Pagination.Root>
      <NativeSelect
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        size="xs"
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
