import { Group, NativeSelect, Pagination } from "@mantine/core";

import type { PlayerDBProps, QuizDBProps } from "@/utils/types";
import type { Table } from "@tanstack/react-table";

type Props = {
  table: Table<PlayerDBProps> | Table<QuizDBProps>;
};

const TablePagenation: React.FC<Props> = ({ table }) => {
  return (
    <Group justify="space-between">
      <Pagination
        total={table.getPageCount()}
        value={table.getState().pagination.pageIndex + 1}
        onChange={(n) => table.setPageIndex(n - 1)}
        size="sm"
        boundaries={1}
      />
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
