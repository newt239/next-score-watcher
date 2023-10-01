/* eslint-disable import/named */
import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsRight } from "tabler-icons-react";

import Button from "#/app/_components/Button";
import Select from "#/app/_components/Select";
import { PlayersDB, QuizDBProps } from "#/utils/types";
import { css } from "@panda/css";

type Props = {
  table: Table<PlayersDB["Row"]> | Table<QuizDBProps>;
};

const TablePagenation: React.FC<Props> = ({ table }) => {
  return (
    <div
      className={css({
        py: "8px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "8px",
      })}
    >
      <Button
        aria-label="最初のページに移動"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.setPageIndex(0)}
        size="sm"
      >
        <ChevronLeft />
      </Button>
      <Button
        aria-label="1ページ戻る"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        size="sm"
      >
        <ChevronLeft />
      </Button>
      <div>
        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
      </div>
      <Button
        aria-label="1ページ進む"
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        size="sm"
      >
        <ChevronRight />
      </Button>
      <Button
        aria-label="最後のページに移動"
        disabled={!table.getCanNextPage()}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        size="sm"
      >
        <ChevronsRight />
      </Button>
      <div>
        <Select
          items={[10, 20, 30, 40, 50].map((pageSize) => {
            return { value: `${pageSize}`, label: `${pageSize}件` };
          })}
          onChange={(e) => {
            console.log(e);
            table.setPageSize(Number(e.value[0]));
          }}
          value={[`${table.getState().pagination.pageSize}`]}
        />
      </div>
    </div>
  );
};

export default TablePagenation;
