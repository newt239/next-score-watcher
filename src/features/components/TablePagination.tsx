import { HStack, IconButton, Select } from "@chakra-ui/react";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "tabler-icons-react";

import { PlayerDBProps, QuizDBProps } from "#/utils/types";

type Props = {
  table: Table<PlayerDBProps> | Table<QuizDBProps>;
};

const TablePagenation: React.FC<Props> = ({ table }) => {
  return (
    <HStack justifyContent="flex-end" pt={3}>
      <IconButton
        aria-label="最初のページに移動"
        disabled={!table.getCanPreviousPage()}
        icon={<ChevronsLeft />}
        onClick={() => table.setPageIndex(0)}
        size="xs"
      />
      <IconButton
        aria-label="1ページ戻る"
        disabled={!table.getCanPreviousPage()}
        icon={<ChevronLeft />}
        onClick={() => table.previousPage()}
        size="xs"
      />
      <div>
        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
      </div>
      <IconButton
        aria-label="1ページ進む"
        disabled={!table.getCanNextPage()}
        icon={<ChevronRight />}
        onClick={() => table.nextPage()}
        size="xs"
      />
      <IconButton
        aria-label="最後のページに移動"
        disabled={!table.getCanNextPage()}
        icon={<ChevronsRight />}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        size="xs"
      />
      <div>
        <Select
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
        </Select>
      </div>
    </HStack>
  );
};

export default TablePagenation;
